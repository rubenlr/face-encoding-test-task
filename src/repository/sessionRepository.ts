import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ListTablesCommand
} from '@aws-sdk/client-dynamodb'
import { Session, Status } from './model'
import AwsProvider from '../utils/AwsProvider'

export default class SessionRepository {
  private readonly dynamoDBClient: DynamoDBClient
  private readonly tableName = 'tb_sessions'

  public constructor (awsProvider: AwsProvider) {
    this.dynamoDBClient = awsProvider.getDynamoDBClient()
  }

  dispose () {
    this.dynamoDBClient.destroy()
  }

  public async putItemAsync (session: Session): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        sessionId: { S: session.sessionId },
        userId: { S: session.userId },
        createdAt: { N: session.createdAt.getTime().toString() },
        expiredAt: { N: session.expiredAt.getTime().toString() },
        status: { S: session.status }
      }
    }
    const command = new PutItemCommand(params)

    await this.dynamoDBClient.send(command)
  }

  async getItemAsync (
    sessionId: string,
    userId: string
  ): Promise<Session | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        sessionId: { S: sessionId },
        userId: { S: userId }
      }
    }
    const command = new GetItemCommand(params)

    try {
      const response = await this.dynamoDBClient.send(command)

      if (response.Item) {
        return {
          sessionId: response.Item.sessionId.S || '',
          userId: response.Item.userId.S || '',
          createdAt: new Date(Number(response.Item.createdAt.N) || ''),
          expiredAt: new Date(Number(response.Item.expiredAt.N) || ''),
          status: response.Item.status.S as Status
        }
      } else {
        return undefined
      }
    } catch (error) {
      console.error('Error retrieving item:', error)
      throw new Error('Could not retrieve item from DynamoDB')
    }
  }
}
