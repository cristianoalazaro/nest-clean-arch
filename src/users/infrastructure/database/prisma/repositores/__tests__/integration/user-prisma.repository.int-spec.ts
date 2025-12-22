import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'

describe('UserPrismaRepository integration tests', () => {
  let prismaService: PrismaService
  let module: TestingModule
  let sut: UserPrismaRepository

  beforeAll(async () => {
    setupPrismaTests()
    prismaService = new PrismaService()
    prismaService.$connect()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(() => {
    sut = new UserPrismaRepository(prismaService)
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
    await prismaService.$disconnect()
  })

  it('Should throw an error when the entity is not found', async () => {
    expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('User not found with ID fakeId'),
    )
  })

  it('Should find a entity by id', async () => {
    const spyFindUnique = jest.spyOn(prismaService.user, 'findUnique')
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({ data: entity.toJSON() })

    expect((await sut.findById(newUser.id)).toJSON()).toStrictEqual(entity.toJSON())
    expect(spyFindUnique).toHaveBeenCalledTimes(1)
  })
})
