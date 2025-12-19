import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { BcryptHashProvider } from '@/users/infrastructure/providers/hashProvider/bcryptjs-hash.provider'
import { UpdatePasswordUserUseCase } from '../../updatePasswordUser.usecase'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

describe('UpdatePasswordUserUseCase unit tests', () => {
  let sut: UpdatePasswordUserUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptHashProvider()
    sut = new UpdatePasswordUserUseCase.UseCase(repository, hashProvider)
  })

  it('Should update a user password', async () => {
    const spyUpdateMethod = jest.spyOn(repository, 'update')
    const hash = await hashProvider.generateHash('123456')
    const entity = new UserEntity(UserDataBuilder({ passsword: hash }))
    repository.items = [entity]

    const result = await sut.execute({
      id: entity.id,
      oldPassword: '123456',
      password: '456789',
    })

    const comparePassword = await hashProvider.compareHash('456789', result.password)

    expect(spyUpdateMethod).toHaveBeenCalledTimes(1)
    expect(comparePassword).toBeTruthy()
  })

  it('Should throw an error when the old password was not provided', async () => {
    await expect(
      sut.execute({ id: 'fakeId', oldPassword: '', password: 'newPass135@' }),
    ).rejects.toThrow(new BadRequestError('Old password and new password is required!'))
  })

  it('Should throw an error when the password was not provided', async () => {
    await expect(
      sut.execute({ id: 'fakeId', oldPassword: 'oldPass135@', password: '' }),
    ).rejects.toThrow(new BadRequestError('Old password and new password is required!'))
  })

  it('Should throw an error when the entity was not found', async () => {
    await expect(
      sut.execute({ id: 'fakeId', oldPassword: 'oldPass135@', password: 'newPass135@' }),
    ).rejects.toThrow(new NotFoundError('Entity not found!'))
  })

  it('Should throw an error when the password does not match', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    repository.items = [entity]

    await expect(
      sut.execute({ id: entity.id, oldPassword: 'oldPass135@', password: 'newPass135@' }),
    ).rejects.toThrow(new InvalidPasswordError('Password is invalid!'))
  })
})
