import { FastifyInstance } from 'fastify'
import request from 'supertest'
import serverApp from '../app'

describe('Image Controller tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = serverApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('POST /image', async () => {
    const response = await request(app.server).post('/image')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ hello: 'postImage' })
  })
})
