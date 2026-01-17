import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositores/user-prisma.repository'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { UpdatePasswordUserUseCase } from '../../updatePasswordUser.usecase'
import { BcryptHashProvider } from '@/users/infrastructure/providers/hashProvider/bcryptjs-hash.provider'

describe('UpdatePasswordUserUseCase integration tests', () => {
  let prismaService: PrismaService
  let userRepository: UserPrismaRepository
  let hashProvider: BcryptHashProvider
  let sut: UpdatePasswordUserUseCase.UseCase

  beforeAll(async () => {
    prismaService = new PrismaService()
    hashProvider = new BcryptHashProvider()
    await prismaService.$connect()
    userRepository = new UserPrismaRepository(prismaService)
  })

  beforeEach(() => {
    sut = new UpdatePasswordUserUseCase.UseCase(userRepository, hashProvider)
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    prismaService.$disconnect()
  })

  it('Should throw an error when the required fields are missing', async () => {
    await expect(
      sut.execute({ id: 'fakeId', password: '', oldPassword: 'fakePassword' }),
    ).rejects.toThrow(new BadRequestError('Old password and new password is required!'))

    await expect(
      sut.execute({ id: 'fakeId', password: 'fakePassword', oldPassword: '' }),
    ).rejects.toThrow(new BadRequestError('Old password and new password is required!'))
  })

  it('Should throw an error when a user is not found', async () => {
    await expect(
      sut.execute({ id: 'fakeId', password: 'password', oldPassword: 'old_password' }),
    ).rejects.toThrow(new NotFoundError('User not found with ID fakeId'))
  })

  it('Should throw an error when the password checking is false', async () => {
    const entity = new UserEntity(UserDataBuilder({ passsword: '123456' }))
    await prismaService.user.create({ data: entity })

    await expect(
      sut.execute({ id: 'fakeId', password: '456789', oldPassword: '111222' }),
    ).rejects.toThrow(new NotFoundError('User not found with ID fakeId'))
  })

  it('Should update a user password', async () => {
    const oldPassword = await hashProvider.generateHash('123456')

    const entity = new UserEntity(UserDataBuilder({ passsword: oldPassword }))
    await prismaService.user.create({ data: entity })

    const output = await sut.execute({ id: entity.id, password: '456789', oldPassword: '123456' })
    const result = await hashProvider.compareHash('456789', output.password)

    expect(result).toBeTruthy()
  })
})
