import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { GetUserUseCase } from '../../getUser.usecase'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositores/user-prisma.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'

describe('GetUserUseCase integration tests', () => {
  let sut: GetUserUseCase.UseCase
  let prismaService: PrismaService
  let userRepository: UserPrismaRepository

  beforeAll(async () => {
    prismaService = new PrismaService()
    await prismaService.$connect()
    userRepository = new UserPrismaRepository(prismaService)
  })

  beforeEach(async () => {
    sut = new GetUserUseCase.UseCase(userRepository)
  })

  afterAll(() => {
    prismaService.$disconnect()
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  it('Should throw an error when the user is not found', async () => {
    await expect(sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('User not found with ID fakeId'),
    )
  })

  it('Should return a user', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}))
    const model = await prismaService.user.create({ data: userEntity })
    const output = await sut.execute({ id: userEntity.id })
    expect(output).toMatchObject(model)
  })
})
