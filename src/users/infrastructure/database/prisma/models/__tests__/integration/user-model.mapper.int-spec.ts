import { execSync } from 'node:child_process'
import { PrismaClient } from 'src/shared/infrastructure/database/generated/prisma'
import { UserModelMapper } from '../../user-model.mapper'
import { ValidationError } from 'src/shared/infrastructure/domain/errors/validation-error'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { setupPrismaTests } from 'src/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('UserModelMapper integration tests', () => {
  jest.setTimeout(10_000)

  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()

    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()
    props = {
      id: '2c0f8b60-8c3b-4bd8-b5d4-7954c00f79a5',
      name: 'Test Name',
      email: 'a@a.com',
      password: 'TestPassword123',
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    if (prismaService) {
      await prismaService.$disconnect()
    }
  })

  it('Should throw an error when user model is invalid', async () => {
    const model = Object.assign(props, { name: null })
    expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError)
  })

  it('Should convert a user model to a user entity', async () => {
    const model = await prismaService.user.create({ data: props })
    const sut = UserModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(UserEntity)
    expect(sut.toJson()).toStrictEqual(props)
  })
})
