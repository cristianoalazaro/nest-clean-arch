import { EntityValidationError } from '@/shared/domain/errors/validation-error'
import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '../testing/helpers/user-data-builder'

let props: UserProps

describe('UserEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Shoud throw an error when creating a user with invalid name', () => {
      props = { ...UserDataBuilder({}), name: null as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Shoud throw an error when creating a user with invalid email', () => {
      props = { ...UserDataBuilder({}), email: null as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 'test email'.repeat(256) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Shoud throw an error when creating a user with invalid password', () => {
      props = { ...UserDataBuilder({}), password: null as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 'a'.repeat(101) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Shoud throw an error when creating a user with invalid createdAt', () => {
      props = { ...UserDataBuilder({}), createdAt: '2025' as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), createdAt: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Shoud create a valid user', () => {
      props = { ...UserDataBuilder({}), createdAt: null as any }
      expect(() => new UserEntity(props)).not.toThrow()

      props = UserDataBuilder({})
      expect(() => new UserEntity(props)).not.toThrow()
    })
  })

  describe('Update method', () => {
    it('Should throw an error when update a user with an invalid name', () => {
      const sut = new UserEntity(UserDataBuilder({}))
      expect(() => sut.updateName(null as any)).toThrow(EntityValidationError)
      expect(() => sut.updateName('')).toThrow(EntityValidationError)
      expect(() => sut.updateName(10 as any)).toThrow(EntityValidationError)
      expect(() => sut.updateName('a'.repeat(256))).toThrow(
        EntityValidationError,
      )
    })

    it('Should update the name of a user entity', () => {
      const sut = new UserEntity(UserDataBuilder({}))
      expect(() => sut.updateName('Test Name')).not.toThrow(
        EntityValidationError,
      )
    })

    it('Should throw an error when update a user with an invalid password', () => {
      const sut = new UserEntity(UserDataBuilder({}))
      expect(() => sut.updatePassword(null as any)).toThrow(
        EntityValidationError,
      )
      expect(() => sut.updatePassword('')).toThrow(EntityValidationError)
      expect(() => sut.updatePassword(10 as any)).toThrow(EntityValidationError)
      expect(() => sut.updatePassword('a'.repeat(101))).toThrow(
        EntityValidationError,
      )
    })

    it('Should update the password of a user entity', () => {
      const sut = new UserEntity(UserDataBuilder({}))
      expect(() => sut.updatePassword('Test Password')).not.toThrow(
        EntityValidationError,
      )
    })
  })
})
