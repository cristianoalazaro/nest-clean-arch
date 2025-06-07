import { UserInMemoryRepository } from 'src/users/infrastructure/database/in-memory/repositories/user-in-memory-repository'
import { UpdatePasswordUseCase } from '../../update-password.usecase'
import { BcryptjsHashProvider } from 'src/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { NotFoundError } from 'src/shared/infrastructure/domain/errors/not-found-error'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import { InvalidPasswordError } from 'src/shared/application/errors/invalid-password-error'
import { HashProvider } from 'src/shared/application/providers/hash-provider'

describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase
  let hashProvider: HashProvider
  let userRepository: UserInMemoryRepository

  beforeEach(() => {
    userRepository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new UpdatePasswordUseCase.UseCase(userRepository, hashProvider)
  })

  it('Should throw an error when user was not found', async () => {
    expect(
      sut.execute({
        id: 'fakeId',
        password: '123456',
        oldPassword: '456789',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'))
  })

  it('Should throw an error when password was not provided', async () => {
    userRepository.items = [
      new UserEntity(UserDataBuilder({ password: '123456' })),
    ]

    expect(
      sut.execute({
        id: userRepository.items[0].id,
        password: null as any,
        oldPassword: '123456',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
  })

  it('Should throw an error when old password was not provided', async () => {
    userRepository.items = [
      new UserEntity(UserDataBuilder({ password: '123456' })),
    ]

    expect(
      sut.execute({
        id: userRepository.items[0].id,
        password: '456789',
        oldPassword: null as any,
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
  })

  it('Should throw an error when old password and current password does not match', async () => {
    const hashPassword = await hashProvider.generateHash('123456')
    userRepository.items = [
      new UserEntity(UserDataBuilder({ password: hashPassword })),
    ]

    expect(
      sut.execute({
        id: userRepository.items[0].id,
        password: '456789',
        oldPassword: '111222',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'))
  })

  it('Should update the password', async () => {
    const hashPassword = await hashProvider.generateHash('123456')
    const spyUpdate = jest.spyOn(userRepository, 'update')

    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))]
    userRepository.items = items

    const result = await sut.execute({
      id: items[0].id,
      password: '456789',
      oldPassword: '123456',
    })

    const checkPassword = await hashProvider.compareHash(
      '456789',
      result.password,
    )

    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(checkPassword).toBeTruthy()
  })
})
