import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositores/user-prisma.repository'
import { UpdateUserUseCase } from '../../updateUser.usecase'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'

describe('UpdateUserUseCase integration tests', () => {
  let prismaService: PrismaService
  let userRepository: UserPrismaRepository
  let sut: UpdateUserUseCase.UseCase

  beforeAll(async () => {
    prismaService = new PrismaService()
    await prismaService.$connect()
    userRepository = new UserPrismaRepository(prismaService)
  })

  beforeEach(() => {
    sut = new UpdateUserUseCase.UseCase(userRepository)
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    prismaService.$disconnect()
  })

  it('Should throw an error when name field is missing', async () => {
    await expect(sut.execute({ id: 'fakeId', name: '' })).rejects.toThrow(
      new BadRequestError('Name not provided!'),
    )
  })

  it('Should throw an error when a user is not found', async () => {
    await expect(sut.execute({ id: 'fakeId', name: 'Test Name' })).rejects.toThrow(
      new NotFoundError('User not found with ID fakeId'),
    )
  })

  it('Should update a user name', async () => {
    const entity = new UserEntity(UserDataBuilder({ name: 'Test Name 1' }))
    await prismaService.user.create({ data: entity })

    const output = await sut.execute({ id: entity.id, name: 'Test Name 2' })

    expect(output.name).toBe('Test Name 2')
  })
})
