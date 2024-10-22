import { type FastifyInstance, type FastifyServerOptions } from 'fastify'
import { postImage, postImageOpts } from '../controller/imageController'

export default async function imageRoutes (
  fastify: FastifyInstance,
  options: FastifyServerOptions
) {
  fastify.post('/', postImageOpts, postImage)
}
