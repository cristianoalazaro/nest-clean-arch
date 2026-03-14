import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { applyGlobalConfig } from '@/global.config'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import request from 'supertest'
import { UsersController } from '../../users.controller'
import { instanceToPlain } from 'class-transformer'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { BcryptHashProvider } from '../../providers/hashProvider/bcryptjs-hash.provider'
import { JwtService } from '@nestjs/jwt'

describe('UsersControllers e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepositoryInterface.Repository
  const prismaService = new PrismaService()
  let updateDto: UpdateUserDto
  let entity: UserEntity
  let hashProvider: HashProvider
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
    await app.init()

    repository = module.get<UserRepositoryInterface.Repository>('UserRepository')
    jwtService = module.get<JwtService>(JwtService)

    hashProvider = new BcryptHashProvider()
    hashPassword = await hashProvider.generateHash('123456')
  }, 10000)

  beforeEach(async () => {
    await prismaService.user.deleteMany()

    updateDto = { name: 'Test Name' }

    entity = new UserEntity(UserDataBuilder({ email: 'test@test.com', password: hashPassword }))
    await repository.insert(entity)

    accessToken = jwtService.sign({ id: entity.id })
  })

  afterAll(async () => {
    await module.close()

    if (app) {
      await app.close()
    }

    await prismaService.$disconnect()
  })

  describe('PUT /users:id', () => {
    it('Should update a user', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send(updateDto)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(Object.keys(res.body)).toStrictEqual(['data'])

      const user = await repository.findById(res.body.data.id)
      const presenter = UsersController.userToResponse(user.toJSON())
      const serialized = instanceToPlain(presenter)
      expect(serialized).toStrictEqual(res.body.data)
    })

    it('Should return an error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send({})
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(422)

      expect(res.body).toStrictEqual({
        message: ['name should not be empty', 'name must be a string'],
        error: 'Unprocessable Entity',
        statusCode: 422,
      })
    })

    it('Should return an error with 422 code when the name field is missing', async () => {
      updateDto.name = ''
      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send(updateDto)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(422)

      expect(res.body).toStrictEqual({
        message: ['name should not be empty'],
        error: 'Unprocessable Entity',
        statusCode: 422,
      })
    })

    it('Should return an error with 404 code when the id is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/fakeId`)
        .send(updateDto)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)

      expect(res.body).toStrictEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'User not found with ID fakeId',
      })
    })

    it('Should return an error with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send(updateDto)
        .expect(401)

      expect(res.body).toStrictEqual({
        statusCode: 401,
        message: 'Unauthorized',
      })
    })
  })
})
