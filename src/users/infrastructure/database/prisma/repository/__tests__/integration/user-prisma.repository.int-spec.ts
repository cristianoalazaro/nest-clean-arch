import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module'
import { PrismaClient } from 'src/shared/infrastructure/database/generated/prisma'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { NotFoundError } from 'src/shared/infrastructure/domain/errors/not-found-error'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { ConflictError } from 'src/shared/infrastructure/domain/errors/conflict-error'

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

  it('Should throw an error on update when an entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError(`User not found using ID ${entity._id}`),
    )
  })

  it('Should update an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({
      data: entity.toJson(),
    })
    entity.updateName('New Name')
    await sut.update(entity)
    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })

    expect(output?.name).toStrictEqual('New Name')
  })

  it('Should throw an error on delete when an entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await expect(sut.delete(entity._id)).rejects.toThrow(
      new NotFoundError(`User not found using ID ${entity._id}`),
    )
  })

  it('Should delete an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({
      data: entity.toJson(),
    })
    await sut.delete(entity._id)
    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })

    expect(output).toBeNull()
  })

  it('Should throw an error when an entity not found', async () => {
    await expect(sut.findByEmail('test@email.com')).rejects.toThrow(
      new NotFoundError(`User not found using email ${'test@email.com'}`),
    )
  })

  it('Should return an entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'test@email.com' }))
    await prismaService.user.create({ data: entity.toJson() })
    expect((await sut.findByEmail('test@email.com')).toJson()).toStrictEqual(
      entity.toJson(),
    )
  })

  it('Should throw an error when an entity is found by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'test@email.com' }))
    await prismaService.user.create({ data: entity.toJson() })
    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError('Email address already used'),
    )
  })

  it('Should not find an entity by email', async () => {
    expect.assertions(0)
    await sut.emailExists('test@email.com')
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
            email: `test${index}@mail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({
        data: entities.map(entity => entity.toJson()),
      })

      const searchOutput = await sut.search(new UserRepository.SearchParams())
      const items = searchOutput.items

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult)
      expect(searchOutput.total).toBe(16)
      expect(searchOutput.items.length).toBe(15)
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity)
      })
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@mail.com`).toStrictEqual(item.email)
      })
    })

    it('Should search using filter, sort and pagination', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({
        data: entities.map(item => item.toJson()),
      })

      const searchOutput1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutput1.items[0].toJson()).toMatchObject(
        entities[0].toJson(),
      )
      expect(searchOutput1.items[1].toJson()).toMatchObject(
        entities[4].toJson(),
      )

      const searchOutput2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutput2.items[0].toJson()).toMatchObject(
        entities[2].toJson(),
      )
    })
  })
})
