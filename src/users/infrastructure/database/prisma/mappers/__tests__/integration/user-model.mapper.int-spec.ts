import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserModelMapper } from '../../user-model.mapper'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { User } from 'generated/prisma/browser'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaService
  let props: any

  beforeAll(async () => {
    setupPrismaTests()
    prismaService = new PrismaService()
    await prismaService.$connect()
  })

  beforeEach(() => {
    props = {
      id: '154fff9b-98f8-47fd-a0ec-afc2263dd076',
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
      createdAt: new Date(),
    }
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('Should throw an erro whit a invalid model', () => {
    const model: User = Object.assign(props, { name: null })
    expect(() => UserModelMapper.toEntity(model)).toThrow(
      new ValidationError('An entity not be loaded!'),
    )
  })

  it('Should convert a user model to a user entity', async () => {
    const model: User = await prismaService.user.create({ data: props })
    const sut = UserModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(UserEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  })
})
