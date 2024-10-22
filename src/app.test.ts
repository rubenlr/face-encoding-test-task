import { FastifyInstance } from 'fastify'
import request from 'supertest'
import serverApp from './app'

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

  test('GET /', async () => {
    const response = await request(app.server).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ hello: 'world' });
  });

  test('GET /ping should return pong', async () => {
    const response = await request(app.server).get('/ping');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ pong: 'it worked!' });
  });
})
