import { type FastifyInstance, type FastifyServerOptions } from 'fastify'
import imageRoutes from './imageRoutes'

export default async function userRoutes (
  fastify: FastifyInstance,
  options: FastifyServerOptions
) {
  fastify.register(imageRoutes, { prefix: 'image' })
}
