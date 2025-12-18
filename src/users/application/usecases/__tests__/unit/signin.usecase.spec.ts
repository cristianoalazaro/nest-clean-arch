import { UserInMemoryRepository } from '@/users/infrastructure/database/repository/user-in-memory.repository'
import { BcryptHashProvider } from '@/users/infrastructure/providers/hashProvider/bcryptjs-hash.provider'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { SigninUseCase } from '../../signin.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InvalidCredentialError } from '@/shared/application/errors/invalid-credential-error'

describe('SigninUseCase unit tests', () => {
  let sut: SigninUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: BcryptHashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptHashProvider()
    sut = new SigninUseCase.UseCase(repository, hashProvider)
  })

  it('Should authenticate a user', async () => {
    const spyFindByEmailMethod = jest.spyOn(repository, 'findByEmail')
    const hash = await hashProvider.generateHash('123456')
    const entity = new UserEntity(UserDataBuilder({ passsword: hash }))
    repository.items = [entity]

    const result = await sut.execute({ email: entity.email, password: '123456' })

    expect(result).toStrictEqual(entity.toJSON())
    expect(spyFindByEmailMethod).toHaveBeenCalledTimes(1)
  })

  it('Should throw an error when email is not provided', async () => {
    await expect(sut.execute({ email: '', password: '123456' })).rejects.toThrow(
      new BadRequestError('Input data not provided!'),
    )
  })

  it('Should throw an error when password is not provided', async () => {
    await expect(sut.execute({ email: 'a@a.com', password: '' })).rejects.toThrow(
      new BadRequestError('Input data not provided!'),
    )
  })

  it('Should throw an error when the user was not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await expect(sut.execute({ email: entity.email, password: entity.password })).rejects.toThrow(
      new NotFoundError(`Entity not found using e-mail: ${entity.email}!`),
    )
  })

  it('Should throw an error when the password does not match', async () => {
    const hash = await hashProvider.generateHash('123456')
    const entity = new UserEntity(UserDataBuilder({ passsword: hash }))
    repository.items = [entity]

    await expect(sut.execute({ email: entity.email, password: '456789' })).rejects.toThrow(
      new InvalidCredentialError(`Invalid password!`),
    )
  })
})
