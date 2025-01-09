import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-buil'
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '../user.validator'

let sut: UserValidator

describe('UserValidator unit tests', () => {
  let isValid: boolean

  beforeEach(() => {
    sut = UserValidatorFactory.create()
  })

  describe('Name field', () => {
    it('Invalidation cases for name field', () => {
      isValid = sut.validate(null)
      expect(isValid).toBe(false)
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), name: '' })
      expect(isValid).toBe(false)
      expect(sut.errors['name']).toStrictEqual(['name should not be empty'])

      isValid = sut.validate({ ...UserDataBuilder({}), name: 1 as any })
      expect(isValid).toBe(false)
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), name: 'a'.repeat(256) })
      expect(isValid).toBe(false)
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ])
    })
  })

  describe('Invalid cases for email field', () => {
    it('Invalid cases for email field', () => {
      isValid = sut.validate(null)
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), email: '' })
      expect(isValid).toBe(false)
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), email: 1 as any })
      expect(isValid).toBe(false)
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), email: 'teste@teste' })
      expect(isValid).toBe(false)
      expect(sut.errors['email']).toStrictEqual(['email must be an email'])

      isValid = sut.validate({ ...UserDataBuilder({}), email: 'a'.repeat(256) })
      expect(isValid).toBe(false)
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ])
    })
  })

  describe('password field', () => {
    it('Invalid cases for password field', () => {
      isValid = sut.validate(null)
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), password: '' })
      expect(isValid).toBe(false)
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), password: 1 as any })
      expect(isValid).toBe(false)
      expect(sut.errors['password']).toStrictEqual([
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ])

      isValid = sut.validate({
        ...UserDataBuilder({}),
        password: 'a'.repeat(101),
      })
      expect(isValid).toBe(false)
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ])
    })
  })

  describe('createdAt field', () => {
    it('Invalid cases for createdAt field', () => {
      isValid = sut.validate({ ...UserDataBuilder({}), createdAt: 1 as any })
      expect(isValid).toBe(false)
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])

      isValid = sut.validate({
        ...UserDataBuilder({}),
        createdAt: '2023' as any,
      })
      expect(isValid).toBe(false)
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])

      /*isValid = sut.validate({ ...UserDataBuilder({}), createdAt: null as any })
      expect(isValid).toBe(true)
      expect(sut.validatedData['createdAt']).toBeInstanceOf(Date)*/
    })
  })

  describe('Valid fields', () => {
    const props = UserDataBuilder({})

    it('Valid cases for user validator class', () => {
      const isValid = sut.validate(props)
      expect(isValid).toBeTruthy()
      expect(sut.validatedData).toStrictEqual(new UserRules(props))
    })
  })
})
