import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-buil'
import { UserEntity, UserProps } from '../../user.entity'
describe('UserEntity integration tests', () => {
  describe('Constructor method', () => {
    let props: UserProps = {
      ...UserDataBuilder({}),
      name: null,
    }

    it('Should throw an error when creating a user with invalid name', () => {
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

      props = {
        ...UserDataBuilder({}),
        name: 1 as any,
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')
    })

    it('Should throw an error when creating a user with invalid email', () => {
      props = {
        ...UserDataBuilder({}),
        email: null,
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')

      props = {
        ...UserDataBuilder({}),
        email: '',
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')

      props = {
        ...UserDataBuilder({}),
        email: 'teste@teste',
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')

      props = {
        ...UserDataBuilder({}),
        email: 'a'.repeat(256),
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')

      props = {
        ...UserDataBuilder({}),
        email: 1 as any,
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')
    })

    it('Should throw an error when creating a user with invalid password', () => {
      props = {
        ...UserDataBuilder({}),
        email: null,
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')

      props = {
        ...UserDataBuilder({}),
        email: '',
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')

      props = {
        ...UserDataBuilder({}),
        email: 'a'.repeat(101),
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')

      props = {
        ...UserDataBuilder({}),
        email: 1 as any,
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')
    })

    it('Should throw an error when creating a user with invalid createdAt', () => {
      props = {
        ...UserDataBuilder({}),
        email: '2025',
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')

      props = {
        ...UserDataBuilder({}),
        email: 1 as any,
      }
      expect(() => new UserEntity(props)).toThrow('Entity Validation Error')
    })

    it('Should a valid user', () => {
      expect.assertions(0) //Não terá erro

      props = {
        ...UserDataBuilder({}),
      }
      new UserEntity(props)
    })
  })
})
