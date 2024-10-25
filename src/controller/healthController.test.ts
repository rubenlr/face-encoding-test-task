import { FastifyInstance } from 'fastify'
import request from 'supertest'
import serverApp from '../app'

describe('Health Controller tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = serverApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('GET /health should be return 200', async () => {
    const response = await request(app.server).get('/health')
    expect(response.status).toBe(200)
  })
})
