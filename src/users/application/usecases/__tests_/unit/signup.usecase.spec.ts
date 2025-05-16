import { UserInMemoryRepository } from 'src/users/infrastructure/database/in-memory/repositories/user-in-memory-repository'
import { HashProvider } from 'src/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from 'src/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { BadRequestError } from 'src/shared/application/errors/bad-request-error'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import { ConflictError } from 'src/shared/infrastructure/domain/errors/conflict-error'
import { SignUpUseCase } from '../../signup.usecase'

describe('SignUpUsecase unit tests', () => {
  let sut: SignUpUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SignUpUseCase.UseCase(repository, hashProvider)
  })

  it('Should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = UserDataBuilder({})
    const result = await sut.execute(props)
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('Should not be able to register the same email twice', async () => {
    const props = UserDataBuilder({})
    await sut.execute(props)
    expect(sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('Should throw a Bad Request Error when name not provided', async () => {
    const props = UserDataBuilder({})
    expect(sut.execute({ ...props, name: null as any })).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    )
  })

  it('Should throw a Bad Request Error when email not provided', async () => {
    const props = UserDataBuilder({})
    expect(sut.execute({ ...props, email: null as any })).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    )
  })

  it('Should throw a Bad Request Error when password not provided', async () => {
    const props = UserDataBuilder({})
    expect(sut.execute({ ...props, password: null as any })).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    )
  })
})
