import type Decimal from 'decimal.js'

export enum Status {
  Iniciated = 'Iniciated',
  Pending = 'Pending',
  Processing = 'Processing',
  Done = 'Done'
}

export interface Session {
  sessionId: string
  userId: string
  createdAt: Date
  expiredAt: Date
  status: Status
}

export interface Image {
  imageId: string
  sessionId: string
  userId: string
  imageName: string
  imageType: string
  createdAt: Date
  expiredAt: Date
  status: Status
  error: string
  result: Decimal[][]
}
