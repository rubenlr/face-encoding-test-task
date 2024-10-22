import fastify, { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify'
import useRoutes from './routes/useRoutes'

export default function build(opts={}): FastifyInstance {
  const app = fastify(opts)

  app.get('/', async function (request: FastifyRequest, reply: FastifyReply) {
    return { hello: 'world' }
  })

  app.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
    return { pong: 'it worked!' };
  });

  app.register(useRoutes)

  return app
}
