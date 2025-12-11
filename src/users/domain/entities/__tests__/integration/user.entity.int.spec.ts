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

    it('Shoud not throw an error', () => {
      props = { ...UserDataBuilder({}), name: 'Test Name' }
      expect(() => new UserEntity(props)).not.toThrow(EntityValidationError)
    })
  })
})
