import { ValidationError } from 'class-validator'
import { UserInMemoryRepository } from '../../user-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  describe('FindByEmail method', () => {
    it('Should throw an error when the email is not found', async () => {
      await expect(sut.findByEmail('test@test.com')).rejects.toThrow(
        new NotFoundError('Entity not found using e-mail: test@test.com!'),
      )
    })

    it('Should return an entity when the email is found', async () => {
      const entity = new UserEntity(UserDataBuilder({ email: 'test@test.com' }))

      await sut.insert(entity)

      expect((await sut.findByEmail('test@test.com')).toJSON()).toStrictEqual(
        entity.toJSON(),
      )
    })
  })

  describe('emailExists method', () => {
    it('Should throw an error when the email is found', async () => {
      const entity = new UserEntity(UserDataBuilder({ email: 'test@test.com' }))

      await sut.insert(entity)
      await expect(sut.emailExists('test@test.com')).rejects.toThrow(
        new ConflictError('E-mail address already used!'),
      )
    })

    it('Should not throw an error when the email is not found', async () => {
      expect(sut.emailExists('test@test.com')).resolves.toBeUndefined()
    })
  })
})
