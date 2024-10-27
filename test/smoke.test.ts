import request from 'supertest'
import waitPort from 'wait-port'

describe('Smoke test the server on port 3000', () => {
  beforeAll(async () => {
    // Wait for port 30 seconds to be ready
    await waitPort({
      host: 'localhost',
      port: 3000,
      timeout: 30000
    })
  })

  test('GET /ping should return pong', async () => {
    const response = await request('http://localhost:3000').get('/ping')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ pong: 'it worked!' })
  })
})
