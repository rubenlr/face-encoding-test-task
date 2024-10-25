import { type FastifyRequest, type FastifyReply } from 'fastify'

export const healthSchema = {
  schema: {
    description: 'Ping the server',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          status: { type: 'string' }
        }
      }
    }
  }
}

export async function healthHandler (
  request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.status(200).send({ status: 'OK' })
}
