import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { applyGlobalConfig } from '@/global.config'
import request from 'supertest'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { instanceToPlain } from 'class-transformer'
import { UsersController } from '../../users.controller'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepositoryInterface.Repository
  let entity: UserEntity
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

    entity = new UserEntity(UserDataBuilder({}))
    await repository.insert(entity)
  })

  afterAll(async () => {
    await module.close()

    if (app) {
      await app.close()
    }

    await prismaService.$disconnect()
  })

  describe('/GET /users/:id', () => {
    it('Should return a user', async () => {
      const res = await request(app.getHttpServer()).get(`/users/${entity.id}`).expect(200)

      expect(Object.keys(res.body)).toStrictEqual(['data'])

      const presenter = UsersController.userToResponse(entity.toJSON())
      const serialized = instanceToPlain(presenter)
      expect(serialized).toStrictEqual(res.body.data)
    })

    it('Should return an error with 404 code when the user is not found', async () => {
      const res = await request(app.getHttpServer()).get(`/users/fake_id`).expect(404)
      expect(res.body).toStrictEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'User not found with ID fake_id',
      })
    })
  })
})
