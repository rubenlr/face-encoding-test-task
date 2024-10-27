import { type Session, Status } from './model'
import SessionRepository from './sessionRepository'
import AwsProvider from '../utils/AwsProvider'
import { v4 as uuidv4 } from 'uuid'

describe('Session repository tests', () => {
  let sessionRepository: SessionRepository

  beforeAll(async () => {
    const provider = await AwsProvider.getInstance()
    sessionRepository = new SessionRepository(provider)
  })

  function getSession (): Session {
    return {
      sessionId: uuidv4(),
      userId: uuidv4(),
      createdAt: new Date(Date.now()),
      expiredAt: new Date(Date.now() + 3600 * 1000),
      status: Status.Iniciated
    }
  }

  test('Create new session', async () => {
    const newSession = getSession()

    await sessionRepository.putItemAsync(newSession)
    const session = await sessionRepository.getItemAsync(
      newSession.sessionId,
      newSession.userId
    )

    expect(session).toEqual(newSession)
  })

  test('Get a non-existent session', async () => {
    const newSession = getSession()

    const session = await sessionRepository.getItemAsync(
      newSession.sessionId,
      newSession.userId
    )

    expect(session).toBeUndefined()
  })
})
