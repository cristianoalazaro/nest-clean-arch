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
import { BcryptHashProvider } from '../../providers/hashProvider/bcryptjs-hash.provider'
import { JwtService } from '@nestjs/jwt'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepositoryInterface.Repository
  let entity: UserEntity
  const prismaService = new PrismaService()
  let hashPassword: string
  let accessToken: string
  let jwtService: JwtService

  beforeAll(async () => {
    setupPrismaTests()

    module = await Test.createTestingModule({
      imports: [EnvConfigModule, UsersModule, DatabaseModule.forTest(prismaService)],
    }).compile()

    app = module.createNestApplication()
    applyGlobalConfig(app)
    app.init()

    repository = module.get<UserRepositoryInterface.Repository>('UserRepository')
    jwtService = module.get<JwtService>(JwtService)

    const hashProvider = new BcryptHashProvider()
    hashPassword = await hashProvider.generateHash('123456')
  }, 10000)

  beforeEach(async () => {
    await prismaService.user.deleteMany()

    entity = new UserEntity(UserDataBuilder({ email: 'test@test.com', password: hashPassword }))
    await repository.insert(entity)

    accessToken = jwtService.sign({ qq: entity.id })
  })

  afterAll(async () => {
    await module.close()

    if (app) {
      await app.close()
    }

    await prismaService.$disconnect()
  })

  describe('DELETE /users/:id', () => {
    it('Should remove a user', async () => {
      return await request(app.getHttpServer())
        .delete(`/users/${entity.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204)
        .expect({})
    })

    it('Should return an error with 404 code when the user is not found', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/users/fake_id`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
      expect(res.body).toStrictEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'User not found with ID fake_id',
      })
    })

    it('Should return an error with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer()).delete(`/users/${entity.id}`).expect(401)
      expect(res.body).toStrictEqual({
        statusCode: 401,
        message: 'Unauthorized',
      })
    })
  })
})
