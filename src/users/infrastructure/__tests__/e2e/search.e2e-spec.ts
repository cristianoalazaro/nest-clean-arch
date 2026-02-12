import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ListUsersDto } from '../../dtos/list-users.dto'
import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import request from 'supertest'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { applyGlobalConfig } from '@/global.config'
import { UserPrismaRepository } from '../../database/prisma/repositores/user-prisma.repository'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { instanceToPlain } from 'class-transformer'
import { UsersController } from '../../users.controller'
import { UserPresenter } from '../../presenters/user.presenter'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let listUsersDto: ListUsersDto
  let repository: UserRepositoryInterface.Repository
  const prismaService = new PrismaService()

  beforeAll(async () => {
    setupPrismaTests()

    module = await Test.createTestingModule({
      imports: [EnvConfigModule, UsersModule, DatabaseModule.forTest(prismaService)],
    }).compile()

    app = module.createNestApplication()
    applyGlobalConfig(app)
    app.init()

    repository = module.get<UserRepositoryInterface.Repository>('UserRepository')
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await prismaService.$disconnect()
    await module.close()

    if (app) await app.close()
  })

  describe('GET /users', () => {
    it('Should list users ordered by createdAt', async () => {
      const createdAt = new Date()
      const arrange = Array(3).fill(UserDataBuilder({}))
      const entities: UserEntity[] = []

      arrange.forEach((entity, index) => {
        entities.push(
          new UserEntity({
            ...entity,
            name: `Test Name ${index}`,
            email: `test${index}@test.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({ data: entities })

      const searchParams = {}
      const queryParams = new URLSearchParams(searchParams)

      const res = await request(app.getHttpServer()).get(`/users?${queryParams}`).expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta'])
      expect(res.body.data).toStrictEqual(
        instanceToPlain(entities.reverse().map(entity => UsersController.userToResponse(entity))),
      )
      expect(res.body.meta).toStrictEqual({ currentPage: 1, perPage: 15, lastPage: 1, total: 3 })
    })

    it('Should return a error with 422 code when the query param is invalid', async () => {
      const res = await request(app.getHttpServer()).get(`/users?fake_id=10`).expect(422)
      expect(res.body).toStrictEqual({
        message: ['property fake_id should not exist'],
        error: 'Unprocessable Entity',
        statusCode: 422,
      })
    })

    it('Should list users ordered, paginated and filtered', async () => {
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
      const entities: UserEntity[] = []

      arrange.forEach((entity, index) => {
        entities.push(
          new UserEntity(
            UserDataBuilder({
              name: entity,
              email: `test${index}@test.com`,
            }),
          ),
        )
      })

      await prismaService.user.createMany({ data: entities })

      let searchParams = {
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      }

      let queryParams = new URLSearchParams(searchParams as any)

      let res = await request(app.getHttpServer()).get(`/users?${queryParams}`).expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta'])
      expect(res.body.data).toStrictEqual(
        instanceToPlain(
          [entities[0], entities[4]].map(entity => UsersController.userToResponse(entity)),
        ),
      )
      expect(res.body.meta).toStrictEqual({ currentPage: 1, perPage: 2, lastPage: 2, total: 3 })

      // Second page
      searchParams = {
        page: 2,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      }

      queryParams = new URLSearchParams(searchParams as any)

      res = await request(app.getHttpServer()).get(`/users?${queryParams}`).expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta'])
      expect(res.body.data).toStrictEqual(
        instanceToPlain([entities[2]].map(entity => UsersController.userToResponse(entity))),
      )
      expect(res.body.meta).toStrictEqual({ currentPage: 2, perPage: 2, lastPage: 2, total: 3 })
    })
  })
})
