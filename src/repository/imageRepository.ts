import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand
} from '@aws-sdk/client-dynamodb'
import Decimal from 'decimal.js'

import { Image, Status } from './model'
import AwsProvider from '../utils/AwsProvider'

export default class ImageRepository {
  private readonly dynamoDBClient: DynamoDBClient
  private readonly tableName = 'tb_images'

  public constructor (awsProvider: AwsProvider) {
    this.dynamoDBClient = awsProvider.getDynamoDBClient()
  }

  dispose () {
    this.dynamoDBClient.destroy()
  }

  public async putItemAsync (image: Image): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        imageId: { S: image.imageId },
        sessionId: { S: image.sessionId },
        userId: { S: image.userId },
        imageName: { S: image.imageName },
        imageType: { S: image.imageType },
        createdAt: { N: image.createdAt.getTime().toString() },
        expiredAt: { N: image.expiredAt.getTime().toString() },
        status: { S: image.status },
        error: { S: image.error },
        result: {
          L: image.result.map(innerArray => ({
            L: innerArray.map(value => ({ N: value.toString() }))
          }))
        }
      }
    }
    const command = new PutItemCommand(params)

    await this.dynamoDBClient.send(command)
  }

  async getItemAsync (
    sessionId: string,
    userId: string
  ): Promise<Image[] | undefined> {
    const params = {
      TableName: this.tableName,
      IndexName: 'SessionUserIndex',
      KeyConditionExpression:
        'sessionId = :sessionIdVal AND userId = :userIdVal',
      ExpressionAttributeValues: {
        ':sessionIdVal': { S: sessionId },
        ':userIdVal': { S: userId }
      }
    }

    const command = new QueryCommand(params)

    try {
      const response = await this.dynamoDBClient.send(command)

      if (response.Items) {
        return response.Items.map((item: any) => {
          const result: Decimal[][] = item.result.L!.map((innerList: any) =>
            innerList.L.map((num: any) => new Decimal(num.N))
          )

          return {
            imageId: item.imageId.S!,
            sessionId: item.sessionId.S!,
            userId: item.userId.S!,
            imageName: item.imageName.S!,
            imageType: item.imageType.S!,
            createdAt: new Date(Number(item.createdAt.N!)),
            expiredAt: new Date(Number(item.expiredAt.N!)),
            status: item.status.S as Status,
            error: item.error.S!,
            result: result
          }
        })
      } else {
        return []
      }
    } catch (error) {
      console.error('Error retrieving item:', error)
      throw new Error('Could not retrieve item from DynamoDB')
    }
  }
}
