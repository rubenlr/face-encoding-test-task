/* Session */

const StatusEnum = {
  type: 'string',
  enum: ['Iniciated', 'Pending', 'Processing', 'Done']
}

const SessionSchema = {
  type: 'object',
  required: ['sessionId', 'status'],
  properties: {
    sessionId: { type: 'string' },
    status: StatusEnum
  }
}

const ImageSchema = {
  type: 'object',
  required: ['imageId', 'status', 'error', 'result'],
  properties: {
    imageId: { type: 'string' },
    status: StatusEnum,
    error: { type: 'string' },
    result: {
      type: 'array',
      items: { type: 'object' }
    }
  }
}
