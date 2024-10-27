import { FastifyInstance } from 'fastify'
import request from 'supertest'
import serverApp from './app'

describe('App running test', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = serverApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('GET /ping should return pong', async () => {
    const response = await request(app.server).get('/ping')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ pong: 'it worked!' })
  })

  test('AWS environment variables should be set correctly', () => {
    expect(process.env.AWS_ACCESS_KEY_ID).toBe('test')
    expect(process.env.AWS_SECRET_ACCESS_KEY).toBe('test')
    expect(process.env.AWS_REGION).toBe('us-east-1')
    expect(process.env.AWS_ENDPOINT_URL).toBe('http://localhost:4566')
  })
})
