import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module'
import { PrismaClient } from 'src/shared/infrastructure/database/generated/prisma'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { NotFoundError } from 'src/shared/infrastructure/domain/errors/not-found-error'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient()
  let module: TestingModule
  let sut: UserPrismaRepository

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any)
    await prismaService.user.deleteMany()
  })

  it('Should throw an error when an entity not found', async () => {
    await expect(() =>
      sut.findById('3f2e0bd9-4563-43dc-9b37-0402975762ae'),
    ).rejects.toThrow(
      new NotFoundError(
        `User not found using ID ${'3f2e0bd9-4563-43dc-9b37-0402975762ae'}`,
      ),
    )
  })

  it('Should find an entity by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({ data: entity.toJson() })
    const output = await sut.findById(newUser.id)
    expect(output.toJson()).toStrictEqual(entity.toJson())
  })

  it('Should create an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    })
    expect(result).toStrictEqual(entity.toJson())
  })

  it('Should return all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({
      data: entity.toJson(),
    })
    const entities = await sut.findAll()
    expect(entities).toHaveLength(1)
    entities.map(item => expect(item.toJson()).toStrictEqual(entity.toJson()))
    // Another way
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
  })
})
