import { HashProvider } from 'src/shared/application/providers/hash-provider'
import { SignInUseCase } from '../../signin-usecase'
import { BcryptjsHashProvider } from 'src/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UserInMemoryRepository } from 'src/users/infrastructure/database/in-memory/repositories/user-in-memory-repository'
import { BadRequestError } from 'src/shared/application/errors/bad-request-error'
import { NotFoundError } from 'src/shared/infrastructure/domain/errors/not-found-error'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import { InvalidCredentialError } from 'src/shared/application/errors/invalid-credential-error'

describe('SignInUseCase unit tests', () => {
  let hashProvider: HashProvider
  let userRepository: UserInMemoryRepository
  let sut: SignInUseCase.UseCase

  beforeEach(() => {
    hashProvider = new BcryptjsHashProvider()
    userRepository = new UserInMemoryRepository()
    sut = new SignInUseCase.UseCase(userRepository, hashProvider)
  })

  it('Should throw an error when email is not provided', async () => {
    expect(
      sut.execute({ email: null as any, password: 'fakePassword' }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'))
  })

  it('Should throw an error when password is not provided', async () => {
    expect(
      sut.execute({ email: 'emailtest@test.com', password: null as any }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'))
  })

  it('Should throw an error when entity is not found', async () => {
    expect(
      sut.execute({ email: 'emailtest@test.com', password: 'fakePassword' }),
    ).rejects.toThrow(
      new NotFoundError(`Entity not found using email ${'emailtest@test.com'}`),
    )
  })

  it('Should not able to authenticate with wrong password', async () => {
    const email = 'emailtest@test.com'
    const password = '123456'
    const hashPassword = await hashProvider.generateHash(password)
    const passwordSent = '456789'
    const entity = new UserEntity(
      UserDataBuilder({ email, password: hashPassword }),
    )
    userRepository.items = [entity]

    expect(sut.execute({ email, password: passwordSent })).rejects.toThrow(
      new InvalidCredentialError(`Invalid credentials`),
    )
  })

  it('Should authenticate a user', async () => {
    const email = 'emailtest@test.com'
    const password = '123456'
    const hashPassword = await hashProvider.generateHash(password)
    const passwordSent = '123456'
    const entity = new UserEntity(
      UserDataBuilder({ email, password: hashPassword }),
    )
    userRepository.items = [entity]

    const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail')

    const result = await sut.execute({ email, password: passwordSent })
    expect(result).toStrictEqual(entity.toJson())
    expect(spyFindByEmail).toHaveBeenCalledTimes(1)
  })
})
