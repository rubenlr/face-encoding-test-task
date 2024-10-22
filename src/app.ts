import fastify, { FastifyInstance } from 'fastify'

export default function build(opts={}): FastifyInstance {
  const app = fastify(opts)

  app.get('/', async function (request, reply) {
    return { hello: 'world' }
  })

  app.get('/ping', async (request, reply) => {
    return { pong: 'it worked!' };
  });

  return app
}
