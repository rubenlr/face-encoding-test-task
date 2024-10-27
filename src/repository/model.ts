export enum Status {
  Iniciated = 'Iniciated',
  Pending = 'Pending',
  Processing = 'Processing',
  Done = 'Done'
}

export interface Session {
  sessionId: string // also indexed as table unique key
  userId: string
  createdAt: Date
  expiredAt: Date
  status: Status
}

export interface Image {
  imageId: string // also indexed as table unique key
  sessionId: string // also indexed as table index
  imageName: string
  imageType: string
  createdAt: Date
  expiredAt: Date
  status: Status
  error: string
  result: [] // json object array that can be saved as string or object if possible
}
