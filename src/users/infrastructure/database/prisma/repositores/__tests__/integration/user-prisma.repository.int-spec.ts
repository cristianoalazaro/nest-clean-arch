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

  it('Should find a, entity by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({ data: entity.toJSON() })

    expect((await sut.findById(newUser.id)).toJSON()).toStrictEqual(entity.toJSON())
  })

  it('Should insert an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const user = await prismaService.user.findUnique({ where: { id: entity.id } })

    expect(user).toStrictEqual(entity.toJSON())
  })

  it('Should return a list of entities', async () => {
    const listEntities = [
      new UserEntity(UserDataBuilder({})),
      new UserEntity(UserDataBuilder({})),
      new UserEntity(UserDataBuilder({})),
    ]

    for (const userEntity of listEntities) {
      await sut.insert(userEntity)
    }

    const listUsers = await sut.findAll()

    expect(listUsers.map(entity => entity.toJSON())).toStrictEqual(
      listEntities.map(entity => entity.toJSON()),
    )
    expect(listUsers).toHaveLength(3)
  })
})
