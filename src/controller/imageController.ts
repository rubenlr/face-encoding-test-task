import { type FastifyRequest, type FastifyReply } from 'fastify'

export const postImageOpts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  }
}

export const postImage = async (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
    return reply.status(200).send({ hello: 'postImage' })
};