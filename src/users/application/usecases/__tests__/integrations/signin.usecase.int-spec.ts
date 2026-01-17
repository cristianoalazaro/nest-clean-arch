import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositores/user-prisma.repository'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { BcryptHashProvider } from '@/users/infrastructure/providers/hashProvider/bcryptjs-hash.provider'
import { SigninUseCase } from '../../signin.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { InvalidCredentialError } from '@/shared/application/errors/invalid-credential-error'

describe('SignInUseCase integration tests', () => {
  let prismaService: PrismaService
  let userRepository: UserPrismaRepository
  let hashProvider: BcryptHashProvider
  let sut: SigninUseCase.UseCase

  beforeAll(async () => {
    prismaService = new PrismaService()
    hashProvider = new BcryptHashProvider()
    await prismaService.$connect()
    userRepository = new UserPrismaRepository(prismaService)
  })

  beforeEach(() => {
    sut = new SigninUseCase.UseCase(userRepository, hashProvider)
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    prismaService.$disconnect()
  })

  it('Should throw an error when the required fields are missing', async () => {
    await expect(sut.execute({ email: '', password: '123456' })).rejects.toThrow(
      new BadRequestError('Input data not provided!'),
    )

    await expect(sut.execute({ email: 'test@test.com', password: '' })).rejects.toThrow(
      new BadRequestError('Input data not provided!'),
    )
  })

  it('Should throw an error when a user is not found', async () => {
    await expect(sut.execute({ email: 'test@test.com', password: '123456' })).rejects.toThrow(
      new NotFoundError('User not found with email test@test.com'),
    )
  })

  it('Should throw an error with the wrong password', async () => {
    const hash = await hashProvider.generateHash('1234546')
    const entity = new UserEntity(UserDataBuilder({ email: 'test@test.com', passsword: hash }))

    await prismaService.user.create({ data: entity })

    await expect(sut.execute({ email: 'test@test.com', password: '123456' })).rejects.toThrow(
      new InvalidCredentialError('Invalid password!'),
    )
  })

  it('Should authenticate a user', async () => {
    const hash = await hashProvider.generateHash('123456')
    const entity = new UserEntity(UserDataBuilder({ email: 'test@test.com', passsword: hash }))

    await prismaService.user.create({ data: entity })

    const output = await sut.execute({ email: 'test@test.com', password: '123456' })

    expect(output).toMatchObject(entity.toJSON())
  })
})
