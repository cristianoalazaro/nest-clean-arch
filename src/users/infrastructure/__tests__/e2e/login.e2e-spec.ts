import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import request from 'supertest'
import { applyGlobalConfig } from '@/global.config'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { SignInDto } from '../../dtos/signIn.dto'
import { BcryptHashProvider } from '../../providers/hashProvider/bcryptjs-hash.provider'

describe('UsersControllers e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepositoryInterface.Repository
  let signinDto: SignInDto
  const prismaService = new PrismaService()
  const hashProvider = new BcryptHashProvider()

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
    signinDto = {
      email: 'test@test.com',
      password: '123456',
    }

    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()

    if (app) {
      await app.close()
    }

    await prismaService.$disconnect()
  })

  describe('POST /users/login', () => {
    it('Should authenticate a user', async () => {
      const hash = await hashProvider.generateHash(signinDto.password)
      const entity = UserDataBuilder({ ...signinDto, email: signinDto.email, passsword: hash })
      await repository.insert(new UserEntity(entity))

      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send(signinDto)
        .expect(200)

      expect(Object.keys(res.body)).toStrictEqual(['accessToken'])
      expect(typeof res.body.accessToken).toEqual('string')
    })

    it('Should return an error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer()).post('/users/login').send({}).expect(422)
      expect(res.body.message).toStrictEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'password should not be empty',
        'password must be a string',
      ])
      expect(res.body.error).toBe('Unprocessable Entity')
    })

    it('Should return an error with 404 code when the email is not found', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send(signinDto)
        .expect(404)
      expect(res.body.message).toStrictEqual('User not found with email test@test.com')
      expect(res.body.error).toBe('Not Found')
    })

    it('Should return an error with 422 code when the email field is invalid', async () => {
      delete signinDto.email
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send(signinDto)
        .expect(422)

      expect(res.body.message).toStrictEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
      ])
      expect(res.body.error).toBe('Unprocessable Entity')
    })

    it('Should return an error with 422 code when the password field is invalid', async () => {
      delete signinDto.password
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send(signinDto)
        .expect(422)

      expect(res.body.message).toStrictEqual([
        'password should not be empty',
        'password must be a string',
      ])
      expect(res.body.error).toBe('Unprocessable Entity')
    })

    it('Should return an error with 400 code when the password field is incorrect', async () => {
      const hash = await hashProvider.generateHash(signinDto.password)
      const entity = UserDataBuilder({ ...signinDto, email: signinDto.email, passsword: hash })

      await repository.insert(new UserEntity(entity))

      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: signinDto.email, password: 'wrongpassword' })
        .expect(400)

      expect(res.body).toStrictEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid password!',
      })
    })
  })
})
