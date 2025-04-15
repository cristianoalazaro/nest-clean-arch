import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'
import { EntityValidationError } from 'src/shared/infrastructure/env-config/domain/errrors/validation-error'

describe('UserEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when create a user with invalid name', () => {
      let props: UserProps = { ...UserDataBuilder({}), name: null as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })
  })
})
