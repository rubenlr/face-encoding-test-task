import { type FastifyRequest, type FastifyReply } from 'fastify'

export const pingSchema = {
  schema: {
    description: 'Ping the server',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          pong: { type: 'string' }
        }
      }
    }
  }
}

export async function pingHandler (
  request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.status(200).send({ pong: 'it worked!' })
}
