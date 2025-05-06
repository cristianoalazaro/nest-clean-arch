import { NotFoundError } from 'src/shared/infrastructure/env-config/domain/errors/not-found-error'
import { UserInMemoryRepository } from '../../user-in-memory-repository'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import { ConflictError } from 'src/shared/infrastructure/env-config/domain/errors/conflict-error'

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  it('Should throw an error when not found - findByEmail method', async () => {
    await expect(sut.findByEmail('test@test.com')).rejects.toThrow(
      new NotFoundError('Entity not found using email test@test.com'),
    )
  })

  it('Should find an entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findByEmail(entity.email)
    expect(result.toJson()).toStrictEqual(entity.toJson())
  })

  it('Should throw an error when found an email - email exists method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError('Email address already used'),
    )
  })

  it('Should return void when an not find an email', async () => {
    expect.assertions(0)
    const result = await sut.emailExists('a@a.com')
  })
})
