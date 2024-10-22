import { FastifyInstance } from 'fastify'
import request from 'supertest'
import serverApp from '../app'

describe('App running test', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = serverApp();
    await app.ready();
    // Start Docker dependencies if necessary
  });
  
  afterAll(async () => {
    await app.close();
    // Stop Docker dependencies if necessary
  });

  test('POST /image', async () => {
    const response = await request(app.server).post('/image');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ hello: 'postImage' });
  });
})
