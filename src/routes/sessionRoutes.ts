import { type FastifyInstance, type FastifyServerOptions } from 'fastify'
import { postSession, postSessionOpts } from '../controller/sessionController'

export default async function sessionRoutes (
  fastify: FastifyInstance,
  options: FastifyServerOptions
) {
  fastify.post('/', postSessionOpts, postSession)
}
