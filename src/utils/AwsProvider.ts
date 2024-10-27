import { S3Client } from '@aws-sdk/client-s3'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Mutex } from 'async-mutex'

export default class AwsProvider {
  private awsConfig: any

  private constructor () {
    this.awsConfig = {
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.AWS_ENDPOINT_URL || 'http://localhost:4566',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
      }
    }
  }

  private static instance: AwsProvider | null = null
  private static mutex = new Mutex()
  public static async getInstance (): Promise<AwsProvider> {
    await AwsProvider.mutex.runExclusive(async () => {
      if (!AwsProvider.instance) {
        AwsProvider.instance = new AwsProvider()
      }
    })
    return AwsProvider.instance!
  }

  public getS3Client (): S3Client {
    return new S3Client(this.awsConfig)
  }

  public getDynamoDBClient (): DynamoDBClient {
    return new DynamoDBClient(this.awsConfig)
  }
}
