import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import serverApp from '../app'

describe('Session controller tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = serverApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  const getUserId = () => {
    return uuidv4()
  }

  test('POST /session without user_id should return 400', async () => {
    const response = await request(app.server).post('/session')
    expect(response.status).toBe(400)
  })

  test('POST /session should create a new session', async () => {
    const response = await request(app.server)
      .post('/session')
      .set('user_id', getUserId())
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('sessionId')
    expect(response.body.sessionId).toHaveLength(36)
  })
})
