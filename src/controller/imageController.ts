import { type FastifyRequest, type FastifyReply } from 'fastify'
import ImageRepository from '../repository/imageRepository'
import AwsProvider from '../utils/AwsProvider'
import axios, { AxiosError } from 'axios'
import FormData from 'form-data'
import { type MultipartFile } from '@fastify/multipart'

export const postImageOpts = {
  schema: {
    consumes: ['multipart/form-data'],
    headers: {
      type: 'object',
      required: ['user_id'],
      properties: {
        user_id: { type: 'string' }
      },
      additionalProperties: true
    },
    produces: ['application/json'],
    response: {
      200: {
        type: 'object',
        properties: {
          imageId: { type: 'string' },
          error: { type: 'string' },
          result: {
            type: 'array',
            items: {
              type: 'array',
              items: { type: 'number' }
            }
          }
        },
        additionalProperties: true
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      },
      500: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
}

const postSelfieAsync = async (file: MultipartFile) => {
  const url = 'http://localhost:8000/v1/selfie'

  const formData = new FormData()
  formData.append('file', file!.file, {
    filename: file!.filename,
    contentType: file!.mimetype
  })

  return await axios.post(url, formData, {
    headers: {
      ...formData.getHeaders()
    }
  })
}

export const postImage = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  //const imageRepository = new ImageRepository(await AwsProvider.getInstance())

  // Get the file
  const file = await request.file()

  if (!file) {
    return reply.status(400).send({ error: 'No image attached' })
  }

  const response = await postSelfieAsync(file).catch(error => {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 400) return axiosError.response
    }
    return reply.status(500).send({ error: 'Failed to post image', e: error })
  })

  if (response!.status === 400) {
    return reply.status(400).send({ error: response!.data.detail })
  }

  return reply.status(200).send({ results: response!.data })
}
