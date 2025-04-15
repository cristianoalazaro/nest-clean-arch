import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'
import { EntityValidationError } from 'src/shared/infrastructure/env-config/domain/errrors/validation-error'

describe('UserEntity integration tests', () => {
  let props: UserProps = { ...UserDataBuilder({}), name: null as any }
  describe('Constructor method', () => {
    it('Should throw an error when create a user with invalid name', () => {
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Should throw an error when create a user with invalid email', () => {
      props = { ...UserDataBuilder({}), email: null as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 'test@test' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Should throw an error when create a user with invalid password', () => {
      props = { ...UserDataBuilder({}), password: null as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 'a'.repeat(101) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })
  })
})
