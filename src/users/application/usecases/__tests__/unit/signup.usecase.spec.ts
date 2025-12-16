import { SignupUseCase } from '../../signup.usecase'
import { UserInMemoryRepository } from '@/users/infrastructure/database/repository/user-in-memory.repository'
import { BcryptHashProvider } from '@/users/infrastructure/providers/hashProvider/bcryptjs-hash.provider'
import { BadRequestError } from '@/users/application/errors/bad-request-error'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('SignUpUseCase unit tests', () => {
  let sut: SignupUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: BcryptHashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptHashProvider()
    sut = new SignupUseCase.UseCase(repository, hashProvider)
  })

  it('Should create a user', async () => {
    const spyInsertMethod = jest.spyOn(repository, 'insert')
    const props = UserDataBuilder({})

    const result = await sut.execute(props)
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(repository.items).toHaveLength(1)
    expect(spyInsertMethod).toHaveBeenCalledTimes(1)
  })

  it('Should not create a user when the email already exists', async () => {
    const props = UserDataBuilder({})

    await sut.execute(props)

    await expect(sut.execute(props)).rejects.toThrow(
      new ConflictError('E-mail address already used!'),
    )

    expect(repository.items).toHaveLength(1)
  })

  it('Should throw an error when name is not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { name: null })
    await expect(sut.execute(props)).rejects.toThrow(
      new BadRequestError('Input data not provided!'),
    )
  })

  it('Should throw an error when email is not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { email: null })
    await expect(sut.execute(props)).rejects.toThrow(
      new BadRequestError('Input data not provided!'),
    )
  })

  it('Should throw an error when password is not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { password: null })
    await expect(sut.execute(props)).rejects.toThrow(
      new BadRequestError('Input data not provided!'),
    )
  })
})
