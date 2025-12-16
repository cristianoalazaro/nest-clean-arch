import { BcryptHashProvider } from '../../bcryptjs-hash.provider'

describe('HashBcryptHashProvider unit tests', () => {
  let sut: BcryptHashProvider

  beforeEach(() => {
    sut = new BcryptHashProvider()
  })

  it('Should return an encrypted password', async () => {
    const password = 'test_password123@'
    const hash = await sut.generateHash(password)
    expect(hash).toBeDefined()
    expect(hash).not.toBe(password)
  })

  it('Should return false on invalid password and hash comparison', async () => {
    const password = 'test_password123@'
    const hash = await sut.generateHash(password)
    const result = await sut.compareHash('fake', hash)
    expect(result).toBeFalsy()
  })

  it('Should return true on valid password and hash comparison', async () => {
    const password = 'test_password123@'
    const hash = await sut.generateHash(password)
    const result = await sut.compareHash(password, hash)
    expect(result).toBeTruthy()
  })
})
