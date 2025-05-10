import { BcryptjsHashProvider } from '../../bcryptjs-hash.provider'

describe('BcryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider

  beforeEach(() => {
    sut = new BcryptjsHashProvider()
  })

  it('Should return encrypted password', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    expect(hash).toBeDefined()
  })

  it('Should return false in invalid password and hash comparison', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    expect(await sut.compareHash('fake', hash)).toBeFalsy()
  })

  it('Should return true in valid password and hash comparison', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    expect(await sut.compareHash(password, hash)).toBeTruthy()
  })
})
