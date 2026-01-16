import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { ListUserUseCase } from '../../listUser.usecase'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositores/user-prisma.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'

describe('ListUserUseCase integration tests', () => {
  let sut: ListUserUseCase.UseCase
  let prismaService: PrismaService
  let userRepository: UserPrismaRepository

  beforeAll(async () => {
    prismaService = new PrismaService()
    await prismaService.$connect()
    userRepository = new UserPrismaRepository(prismaService)
  })

  beforeEach(() => {
    sut = new ListUserUseCase.UseCase(userRepository)
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('Should return a list of users sorted by createdAt', async () => {
    const createdAt = new Date()
    const entities: UserEntity[] = []
    const arrange = Array(3).fill(UserDataBuilder({}))

    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity({
          ...element,
          createdAt: new Date(createdAt.getTime() + index),
          email: `test${index}@test.com`,
        }),
      )
    })

    await prismaService.user.createMany({ data: entities.map(entity => entity.toJSON()) })

    const output = await sut.execute({})

    expect(output).toMatchObject({
      items: entities.reverse().map(item => item.toJSON()),
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    })
  })

  it('Should search using sort, filter and paginate', async () => {
    const createdAt = new Date()
    const entities: UserEntity[] = []
    const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']

    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity(
          UserDataBuilder({ createdAt: new Date(createdAt.getTime() + index), name: element }),
        ),
      )
    })

    await prismaService.user.createMany({ data: entities.map(entity => entity.toJSON()) })

    let output = await sut.execute({
      filter: 'TEST',
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
    })

    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    })

    output = await sut.execute({
      filter: 'TEST',
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
    })

    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    })
  })
})
