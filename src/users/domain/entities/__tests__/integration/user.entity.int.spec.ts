import { EntityValidationError } from '@/shared/domain/errors/validation-error'
import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '../testing/helpers/user-data-builder'

let props: UserProps

describe('UserEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Shoud throw an error', () => {
      props = { ...UserDataBuilder({}), name: null as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Shoud not throw an error', () => {
      props = { ...UserDataBuilder({}), name: 'Test Name' }
      expect(() => new UserEntity(props)).not.toThrow(EntityValidationError)
    })
  })
})
