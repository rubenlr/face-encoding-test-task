import { type Image, Status } from './model'
import ImageRepository from './imageRepository'
import AwsProvider from '../utils/AwsProvider'
import { v4 as uuidv4 } from 'uuid'
import Decimal from 'decimal.js'

describe('Image repository tests', () => {
  let imageRepository: ImageRepository

  beforeAll(async () => {
    const provider = await AwsProvider.getInstance()
    imageRepository = new ImageRepository(provider)
  })

  function getImage (): Image {
    return {
      imageId: uuidv4(),
      sessionId: uuidv4(),
      userId: uuidv4(),
      imageName: uuidv4(),
      imageType: uuidv4(),
      createdAt: new Date(Date.now()),
      expiredAt: new Date(Date.now() + 3600 * 1000),
      status: Status.Iniciated,
      error: '',
      result: []
    }
  }

  test('Create new image for a session', async () => {
    const newImage = getImage()

    await imageRepository.putItemAsync(newImage)
    const image = await imageRepository.getItemAsync(
      newImage.sessionId,
      newImage.userId
    )

    expect(image).toBeInstanceOf(Array)
    expect(image?.length).toBe(1)
    expect(image?.at(0)).toEqual(newImage)
  })

  test('Should save and update image', async () => {
    const newImage = getImage()

    await imageRepository.putItemAsync(newImage)
    newImage.result.push([new Decimal(1), new Decimal(2), new Decimal(3)])
    await imageRepository.putItemAsync(newImage)
    const image = await imageRepository.getItemAsync(
      newImage.sessionId,
      newImage.userId
    )

    expect(image).toBeInstanceOf(Array)
    expect(image?.length).toBe(1)
    expect(image?.at(0)).toEqual(newImage)
  })

  test('Should not GET a non-existent image', async () => {
    const newImage = getImage()

    const image = await imageRepository.getItemAsync(
      newImage.sessionId,
      newImage.userId
    )

    expect(image).toBeInstanceOf(Array)
    expect(image?.length).toBe(0)
  })

  test('Should not get a image from another user', async () => {
    const newImage = getImage()

    await imageRepository.putItemAsync(newImage)
    const image = await imageRepository.getItemAsync(
      newImage.sessionId,
      uuidv4()
    )

    expect(image).toBeInstanceOf(Array)
    expect(image?.length).toBe(0)
  })
})
