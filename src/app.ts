import fastify, {
  type FastifyInstance,
  type FastifyRequest,
  type FastifyReply
} from 'fastify'
import useRoutes from './routes/useRoutes'

export default function build (opts = {}): FastifyInstance {
  const app = fastify(opts)

  app.get('/', async function (request: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send({ hello: 'world' })
  })

  app.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({ pong: 'it worked!' })
  })

  app.get('/health', (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({ status: 'OK' })
  })

  app.register(useRoutes)

  return app
}
