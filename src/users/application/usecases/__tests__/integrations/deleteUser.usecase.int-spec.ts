import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositores/user-prisma.repository'
import { DeleteUserUseCase } from '../../deleteUser.usecase'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'

describe('DeleteUserUseCase integration tests', () => {
  let sut: DeleteUserUseCase.UseCase
  let userRepository: UserPrismaRepository
  let prismaService: PrismaService

  beforeAll(() => {
    prismaService = new PrismaService()
    userRepository = new UserPrismaRepository(prismaService)
  })

  beforeEach(() => {
    sut = new DeleteUserUseCase.UseCase(userRepository)
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  afterAll(() => {
    prismaService.$disconnect()
  })

  it('Should throw an erro when the input field is missing', async () => {
    expect(sut.execute({ id: '' })).rejects.toThrow(new BadRequestError('Id not provided!'))
  })

  it('Should throw an erro when the entity is not found', async () => {
    await expect(() => sut.execute({ id: 'fake_id' })).rejects.toThrow(
      new NotFoundError(`User not found with ID fake_id`),
    )
  })

  it('Should delete an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({ data: entity })

    await sut.execute({ id: entity.id })

    const result = await prismaService.user.findUnique({ where: { id: entity.id } })

    expect(result).toBeNull()
  })
})
