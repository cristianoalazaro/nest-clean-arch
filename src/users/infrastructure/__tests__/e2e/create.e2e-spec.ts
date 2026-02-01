import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { SignUpDto } from '../../dtos/signUp.dto'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import request from 'supertest'
import { UsersController } from '../../users.controller'
import { instanceToPlain } from 'class-transformer'
import { applyGlobalConfig } from '@/global.config'

describe('UsersControllers unit tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepositoryInterface.Repository
  let signupDto: SignUpDto
  const prismaService = new PrismaService()

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [EnvConfigModule, UsersModule, DatabaseModule.forTest(prismaService)],
    }).compile()

    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()

    repository = module.get<UserRepositoryInterface.Repository>('UserRepository')
  }, 60000)

  beforeEach(async () => {
    signupDto = {
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    }

    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    if (app) {
      await app.close()
    }

    await prismaService.$disconnect()
  })

  describe('POST /users', () => {
    it('Should create a user', async () => {
      const res = await request(app.getHttpServer()).post('/users').send(signupDto).expect(201)

      expect(Object.keys(res.body)).toStrictEqual(['id', 'name', 'email', 'createdAt'])

      const user = await repository.findById(res.body.id)
      const presenter = UsersController.userToResponse(user.toJSON())
      const serialized = instanceToPlain(presenter)
      expect(serialized).toStrictEqual(res.body)
    })
  })
})
