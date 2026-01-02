import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositores/user-prisma.repository'
import { SignupUseCase } from '../../signup.usecase'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { BcryptHashProvider } from '@/users/infrastructure/providers/hashProvider/bcryptjs-hash.provider'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { UserOutputMapper } from '@/users/application/dtos/user-output'

describe('SignUpUseCase integration tests', () => {
  let sut: SignupUseCase.UseCase
  let userRepository: UserPrismaRepository
  let hasprovider: HashProvider
  let prismaService: PrismaService

  beforeAll(() => {
    prismaService = new PrismaService()
    prismaService.$connect()
    userRepository = new UserPrismaRepository(prismaService)
    hasprovider = new BcryptHashProvider()
  })

  beforeEach(async () => {
    sut = new SignupUseCase.UseCase(userRepository, hasprovider)
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  afterAll(() => {
    prismaService.$disconnect()
  })

  it('Should throw an erro when input filds are missing', async () => {
    expect(
      sut.execute({ name: null, email: null, password: null } as unknown as SignupUseCase.Input),
    ).rejects.toThrow(new BadRequestError('Input data not provided!'))
  })

  it('Should create a user', async () => {
    const input: SignupUseCase.Input = {
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    }

    const output = await sut.execute(input)

    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeInstanceOf(Date)
  })
})
