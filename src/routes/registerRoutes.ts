import { type FastifyInstance, type FastifyServerOptions } from 'fastify'
import imageRoutes from './imageRoutes'
import sessionRoutes from './sessionRoutes'
import { pingSchema, pingHandler } from '../controller/pingController'
import { healthSchema, healthHandler } from '../controller/healthController'

export default async function registerRoutes (
  fastify: FastifyInstance,
  options: FastifyServerOptions
) {
  fastify.get('/ping', pingSchema, pingHandler)
  fastify.get('/health', healthSchema, healthHandler)
  await fastify.register(imageRoutes, { prefix: 'image' })
  await fastify.register(sessionRoutes, { prefix: 'session' })
}
