import { UserDataBuilder } from 'src/users/domain/testing/helpers/user-data-builder'
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '../../user.validator'

let sut: UserValidator
let validData: boolean

describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create()
  })

  it('valid case for User-validator class', () => {
    const props = UserDataBuilder({})
    validData = sut.validate(props)
    expect(validData).toBeTruthy()
    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toStrictEqual(new UserRules(props))
  })

  describe('Name field', () => {
    it('Invalid uses for name field', () => {
      validData = sut.validate(null as any)
      expect(validData).toBeFalsy()
      expect(sut.errors!['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name should not be empty',
        'name must be a string',
      ])

      validData = sut.validate({ ...UserDataBuilder({}), name: '' })
      expect(validData).toBeFalsy()
      expect(sut.errors!['name']).toStrictEqual(['name should not be empty'])

      validData = sut.validate({
        ...UserDataBuilder({}),
        name: 'a'.repeat(256),
      })
      expect(validData).toBeFalsy()
      expect(sut.errors!['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ])

      validData = sut.validate({ ...UserDataBuilder({}), name: 10 as any })
      expect(validData).toBeFalsy()
      expect(sut.errors!['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
      ])
    })
  })

  describe('Email field', () => {
    it('Invalid uses for email field', () => {
      validData = sut.validate(null as any)
      expect(validData).toBeFalsy()
      expect(sut.errors!['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email should not be empty',
        'email must be an email',
      ])

      validData = sut.validate({ ...UserDataBuilder({}), email: '' })
      expect(validData).toBeFalsy()
      expect(sut.errors!['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ])

      validData = sut.validate({
        ...UserDataBuilder({}),
        email: 'a'.repeat(256),
      })
      expect(validData).toBeFalsy()
      expect(sut.errors!['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email must be an email',
      ])

      validData = sut.validate({ ...UserDataBuilder({}), email: 10 as any })
      expect(validData).toBeFalsy()
      expect(sut.errors!['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email must be an email',
      ])

      validData = sut.validate({
        ...UserDataBuilder({}),
        email: 'Email@teste' as any,
      })
      expect(validData).toBeFalsy()
      expect(sut.errors!['email']).toStrictEqual(['email must be an email'])
    })
  })

  describe('Password field', () => {
    it('Invalid uses for password field', () => {
      validData = sut.validate(null as any)
      expect(validData).toBeFalsy()
      expect(sut.errors!['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
        'password should not be empty',
        'password must be a string',
      ])

      validData = sut.validate({ ...UserDataBuilder({}), password: '' })
      expect(validData).toBeFalsy()
      expect(sut.errors!['password']).toStrictEqual([
        'password should not be empty',
      ])

      validData = sut.validate({
        ...UserDataBuilder({}),
        password: 'a'.repeat(101),
      })
      expect(validData).toBeFalsy()
      expect(sut.errors!['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ])

      validData = sut.validate({ ...UserDataBuilder({}), password: 10 as any })
      expect(validData).toBeFalsy()
      expect(sut.errors!['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
        'password must be a string',
      ])
    })
  })
})
