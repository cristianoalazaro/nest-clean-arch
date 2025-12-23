import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'

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

  describe('Search method tests', () => {
    it('Should apply only pagination when the other params are null', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = Array(16).fill(UserDataBuilder({}))

      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            name: `User ${index}`,
            email: `user${index}@test.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({ data: entities.map(entity => entity.toJSON()) })
      const searchOutput = await sut.search(new UserRepositoryInterface.SearchParams())

      expect(searchOutput).toBeInstanceOf(UserRepositoryInterface.SearchResults)
      expect(searchOutput.items.length).toBe(15)
      expect(searchOutput.total).toEqual(16)
    })

    it('Should search using filter, sort and pagination', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = ['test', 'a', 'TEST', 'b', 'TeST']

      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({ data: entities.map(entity => entity.toJSON()) })
      const searchOutputPage1 = await sut.search(
        new UserRepositoryInterface.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage1.items.length).toBe(2)
      expect(searchOutputPage1.total).toEqual(3)
      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(entities[0].toJSON())
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(entities[4].toJSON())

      const searchOutputPage2 = await sut.search(
        new UserRepositoryInterface.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage2.items.length).toBe(1)
      expect(searchOutputPage2.total).toEqual(3)
      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(entities[2].toJSON())
    })
  })

  it('Should update an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    entity.updateName('Altered Name')
    await sut.update(entity)
    const updatedUser = await prismaService.user.findUnique({ where: { id: entity.id } })

    expect(updatedUser).toStrictEqual(entity.toJSON())
    expect(updatedUser?.name).toStrictEqual(entity.name)
  })

  it('Should throw an error when an entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError(`User not found with ID ${entity.id}`),
    )
  })
})
