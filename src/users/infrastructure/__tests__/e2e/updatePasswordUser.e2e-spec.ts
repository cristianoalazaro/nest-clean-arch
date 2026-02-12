import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { applyGlobalConfig } from '@/global.config'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import request from 'supertest'
import { UsersController } from '../../users.controller'
import { instanceToPlain } from 'class-transformer'
import { UpdatePasswordUserDto } from '../../dtos/updatePassword-user.dto'
import { BcryptHashProvider } from '../../providers/hashProvider/bcryptjs-hash.provider'
import { HashProvider } from '@/shared/application/providers/hash.provider'

describe('UsersControllers e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepositoryInterface.Repository
  let updatePasswordDto: UpdatePasswordUserDto
  let entity: UserEntity
  let hashProvider: HashProvider
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
    hashProvider = new BcryptHashProvider()
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()

    const oldPassword = '123456'
    const hashOldPassword = await hashProvider.generateHash(oldPassword)
    const newPassword = '456789'

    updatePasswordDto = { oldPassword, password: newPassword }

    entity = new UserEntity(UserDataBuilder({ passsword: hashOldPassword }))
    await repository.insert(entity)
  })

  afterAll(async () => {
    await module.close()

    if (app) {
      await app.close()
    }

    await prismaService.$disconnect()
  })

  describe('PATCH /users:id', () => {
    it('Should update a password', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDto)
        .expect(200)

      expect(Object.keys(res.body)).toStrictEqual(['data'])

      const user = await repository.findById(res.body.data.id)
      const checkNewPassword = await hashProvider.compareHash('456789', user.password)
      expect(checkNewPassword).toBeTruthy()
    })

    it('Should return an error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send({})
        .expect(422)

      expect(res.body).toStrictEqual({
        message: [
          'password should not be empty',
          'password must be a string',
          'oldPassword should not be empty',
          'oldPassword must be a string',
        ],
        error: 'Unprocessable Entity',
        statusCode: 422,
      })
    })

    it('Should return an error with 422 code when the password field is invalid', async () => {
      delete updatePasswordDto.password
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDto)
        .expect(422)

      expect(res.body).toStrictEqual({
        message: ['password should not be empty', 'password must be a string'],
        error: 'Unprocessable Entity',
        statusCode: 422,
      })
    })

    it('Should return an error with 422 code when the oldPassword field is invalid', async () => {
      delete updatePasswordDto.oldPassword
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDto)
        .expect(422)

      expect(res.body).toStrictEqual({
        message: ['oldPassword should not be empty', 'oldPassword must be a string'],
        error: 'Unprocessable Entity',
        statusCode: 422,
      })
    })

    it('Should return an error with 404 code when the id is invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/fakeId`)
        .send(updatePasswordDto)
        .expect(404)

      expect(res.body).toStrictEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'User not found with ID fakeId',
      })
    })

    it('Should return an error with 422 code when the password does not match', async () => {
      updatePasswordDto.oldPassword = 'fake_password'

      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDto)
        .expect(422)

      expect(res.body).toStrictEqual({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Password is invalid!',
      })
    })
  })
})
