import { type FastifyRequest, type FastifyReply } from 'fastify'
import { v4 as uuidv4 } from 'uuid'
import SessionRepository from '../repository/sessionRepository'
import AwsProvider from '../utils/AwsProvider'
import { type Session, Status } from '../repository/model'

export const postSessionOpts = {
  schema: {
    headers: {
      type: 'object',
      required: ['user_id'],
      properties: {
        user_id: { type: 'string' }
      },
      additionalProperties: true
    },
    response: {
      200: {
        type: 'object',
        properties: {
          sessionId: { type: 'string' }
        }
      }
    }
  }
}

export const postSession = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const sessionRepository = new SessionRepository(
    await AwsProvider.getInstance()
  )
  const { user_id } = request.headers
  if (typeof user_id !== 'string') {
    return reply.status(400).send({ error: 'user_id is required' })
  }

  const session: Session = {
    sessionId: uuidv4(),
    userId: String(user_id),
    createdAt: new Date(),
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    status: Status.Iniciated
  }

  try {
    await sessionRepository.putItemAsync(session)
    return reply.status(200).send({ sessionId: session.sessionId })
  } catch (error) {
    console.error('Error creating session:', error)
    return reply.status(400).send({ error: 'Could not create session' })
  }
}
