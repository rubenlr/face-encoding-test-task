import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import FormData from 'form-data'
import fs from 'fs'
import serverApp from '../app'

const timeout = 1000 * 60 * 5

describe('Image Controller tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = serverApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  const createSessionIdAsync = async (user_id: string): Promise<string> => {
    const response = await request(app.server)
      .post('/session')
      .set('user_id', user_id)
      .expect(200)

    return response.body.sessionId.toString()
  }

  const getFile = (file: string) =>
    path.resolve(__dirname, `../../test/${file}`)

  test(
    'POST /image should return the image value for a valid session created',
    async () => {
      const userId = uuidv4()
      const sessionId = await createSessionIdAsync(userId)
      const file = getFile('one-face.jpg')

      const form = new FormData()
      form.append('file', fs.createReadStream(file))
      form.append('session_id', sessionId)
      form.append('image_name', 'John Foto')

      const response = await app.inject({
        method: 'POST',
        url: '/image',
        headers: {
          ...form.getHeaders(),
          user_id: userId
        },
        payload: form
      })

      expect(response.statusCode).toBe(200)

      const body = JSON.parse(response.body)

      expect(body).toBeInstanceOf(Object)
      expect(body).toHaveProperty('results')

      const results = body.results

      expect(results).toBeInstanceOf(Array)
      expect(results.length).toBe(1)
      expect(results?.at(0)).toBeInstanceOf(Array)
      expect(results?.at(0)?.length).toBe(128)

      return response
    },
    timeout
  )

  test(
    'POST /image should return error with invalid image (more than 5 faces)',
    async () => {
      const userId = uuidv4()
      const sessionId = await createSessionIdAsync(userId)
      const file = getFile('seven-faces.jpg')

      const form = new FormData()
      form.append('file', fs.createReadStream(file))
      form.append('session_id', sessionId)

      const response = await app.inject({
        method: 'POST',
        url: '/image',
        headers: {
          ...form.getHeaders(),
          user_id: userId
        },
        payload: form
      })

      expect(response.statusCode).toBe(400)

      const body = JSON.parse(response.body)

      expect(body).toBeInstanceOf(Object)
      expect(body).toHaveProperty('error')

      expect(body.error).toBe('More than 5 faces found')

      return response
    },
    timeout
  )

  test(
    'POST /image should return empty array if the image has no faces',
    async () => {
      const userId = uuidv4()
      const sessionId = await createSessionIdAsync(userId)
      const file = getFile('zero-faces.jpg')

      const form = new FormData()
      form.append('file', fs.createReadStream(file))
      form.append('session_id', sessionId)

      const response = await app.inject({
        method: 'POST',
        url: '/image',
        headers: {
          ...form.getHeaders(),
          user_id: userId
        },
        payload: form
      })

      expect(response.statusCode).toBe(200)

      const body = JSON.parse(response.body)

      expect(body).toBeInstanceOf(Object)
      expect(body).toHaveProperty('results')

      const results = body.results

      expect(results).toBeInstanceOf(Array)
      expect(results.length).toBe(0)

      return response
    },
    timeout
  )

  test(
    'POST /image should fail if no image is attached',
    async () => {
      const userId = uuidv4()
      const sessionId = await createSessionIdAsync(userId)

      const form = new FormData()
      form.append('session_id', sessionId)
      form.append('image_name', 'John Foto')

      const response = await app.inject({
        method: 'POST',
        url: '/image',
        headers: {
          ...form.getHeaders(),
          user_id: userId
        },
        payload: form
      })

      expect(response.statusCode).toBe(400)

      const body = JSON.parse(response.body)

      expect(body).toBeInstanceOf(Object)
      expect(body).toHaveProperty('error')
      expect(body.error).toBe('No image attached')

      return response
    },
    timeout
  )
})
