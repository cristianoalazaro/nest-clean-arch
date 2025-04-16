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

    it('Should throw an error when create a user with invalid createdAt', () => {
      props = { ...UserDataBuilder({}), createdAt: '2025' as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Should create a valid user', () => {
      expect.assertions(0)

      props = { ...UserDataBuilder({}) }

      new UserEntity(props)
    })
  })

  describe('Update methods', () => {
    const props = { ...UserDataBuilder({}) }

    it('Should throw an error when update a user with invalid name ', () => {
      const userEntity = new UserEntity(props)
      expect(() => userEntity.updateName(null as any)).toThrow(
        EntityValidationError,
      )
      expect(() => userEntity.updateName('')).toThrow(EntityValidationError)
      expect(() => userEntity.updateName('a'.repeat(256))).toThrow(
        EntityValidationError,
      )
      expect(() => userEntity.updateName(10 as any)).toThrow(
        EntityValidationError,
      )
    })

    it('Should update a user with a valid name', () => {
      expect.assertions(0)
      const userEntity = new UserEntity(props)
      userEntity.updateName('Test Name')
    })

    it('Should throw an error when update a user with invalid password ', () => {
      const userEntity = new UserEntity(props)
      expect(() => userEntity.updatePassword(null as any)).toThrow(
        EntityValidationError,
      )
      expect(() => userEntity.updatePassword('')).toThrow(EntityValidationError)
      expect(() => userEntity.updatePassword('a'.repeat(101))).toThrow(
        EntityValidationError,
      )
      expect(() => userEntity.updatePassword(10 as any)).toThrow(
        EntityValidationError,
      )
    })

    it('Should update a user with a valid password', () => {
      expect.assertions(0)
      const userEntity = new UserEntity(props)
      userEntity.updatePassword('Test_password')
    })
  })
})
