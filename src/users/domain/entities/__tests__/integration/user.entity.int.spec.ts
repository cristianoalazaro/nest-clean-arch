import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-buil'
import { UserEntity, UserProps } from '../../user.entity'
describe('UserEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a user with invalid name', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        name: null,
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')

      props = {
        ...UserDataBuilder({}),
        name: '',
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')

      props = {
        ...UserDataBuilder({}),
        name: 'a'.repeat(256),
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')
    })
  })
})
