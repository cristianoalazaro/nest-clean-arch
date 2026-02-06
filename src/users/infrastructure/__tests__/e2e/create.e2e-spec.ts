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
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'

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

      expect(Object.keys(res.body)).toStrictEqual(['data'])

      const user = await repository.findById(res.body.data.id)
      const presenter = UsersController.userToResponse(user.toJSON())
      const serialized = instanceToPlain(presenter)
      expect(serialized).toStrictEqual(res.body.data)
    })

    it('Should return an error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer()).post('/users').send({}).expect(422)
      expect(res.body.message).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'password should not be empty',
        'password must be a string',
      ])
      expect(res.body.error).toBe('Unprocessable Entity')
    })

    it('Should return an error with 422 code when the name field is invalid', async () => {
      delete signupDto.name
      const res = await request(app.getHttpServer()).post('/users').send(signupDto).expect(422)
      expect(res.body.message).toStrictEqual(['name should not be empty', 'name must be a string'])
      expect(res.body.error).toBe('Unprocessable Entity')
    })

    it('Should return an error with 422 code when the email field is invalid', async () => {
      delete signupDto.email
      const res = await request(app.getHttpServer()).post('/users').send(signupDto).expect(422)
      expect(res.body.message).toStrictEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
      ])
      expect(res.body.error).toBe('Unprocessable Entity')
    })

    it('Should return an error with 422 code when the password field is invalid', async () => {
      delete signupDto.password
      const res = await request(app.getHttpServer()).post('/users').send(signupDto).expect(422)
      expect(res.body.message).toStrictEqual([
        'password should not be empty',
        'password must be a string',
      ])
      expect(res.body.error).toBe('Unprocessable Entity')
    })

    it('Should return an error with 422 code when invalid field provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(Object.assign(signupDto, { xpto: 'fake' }))
        .expect(422)
      expect(res.body.message).toStrictEqual(['property xpto should not exist'])
      expect(res.body.error).toBe('Unprocessable Entity')
    })

    it('Should return an error with 409 code when the email field is duplicated', async () => {
      const entity = new UserEntity(UserDataBuilder({ ...signupDto }))
      await repository.insert(entity)

      const res = await request(app.getHttpServer()).post('/users').send(signupDto).expect(409)
      expect(res.body).toStrictEqual({
        statusCode: 409,
        error: 'Conflict',
        message: 'E-mail already already used',
      })
    })
  })
})
