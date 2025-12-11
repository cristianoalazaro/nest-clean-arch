import { UserDataBuilder } from '@/users/domain/entities/__tests__/testing/helpers/user-data-builder'
import { UserRules, UserValidator } from '../../user.validator'

let sut: UserValidator
let isValid: boolean

describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = new UserValidator()
  })

  describe('Name field', () => {
    it('Invalid cases for name field', () => {
      isValid = sut.validate(null as any)
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), name: '' })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual(['name should not be empty'])

      isValid = sut.validate({ ...UserDataBuilder({}), name: 'a'.repeat(256) })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), name: 1 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
      ])
    })

    it('Valid case for name field', () => {
      const props = { ...UserDataBuilder({}), name: 'Test Name' }
      isValid = sut.validate(props)
      expect(isValid).toBeTruthy()
      expect(sut.errors).toStrictEqual(null)
      expect(sut.validatedData).toStrictEqual(new UserRules(props))
    })
  })

  describe('Email field', () => {
    it('Invalid cases for email field', () => {
      isValid = sut.validate(null as any)
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be shorter than or equal to 255 characters',
        'email must be an email',
        'email must be a string',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), email: '' })
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), email: 'a'.repeat(256) })
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email must be an email',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), email: 'Test email' })
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual(['email must be an email'])

      isValid = sut.validate({ ...UserDataBuilder({}), email: 1 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email must be an email',
        'email must be a string',
      ])
    })

    it('Valid case for email field', () => {
      const props = { ...UserDataBuilder({}), email: 'email@test.com' }
      isValid = sut.validate(props)
      expect(isValid).toBeTruthy()
      expect(sut.errors).toStrictEqual(null)
      expect(sut.validatedData).toStrictEqual(new UserRules(props))
    })
  })

  describe('password field', () => {
    it('Invalid cases for password field', () => {
      isValid = sut.validate(null as any)
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
        'password must be shorter than or equal to 100 characters',
        'password must be a string',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), password: '' })
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
      ])

      isValid = sut.validate({
        ...UserDataBuilder({}),
        password: 'a'.repeat(256),
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), password: 1 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
        'password must be a string',
      ])
    })

    it('Valid case for password field', () => {
      const props = { ...UserDataBuilder({}), password: '123456' }
      isValid = sut.validate(props)
      expect(isValid).toBeTruthy()
      expect(sut.errors).toStrictEqual(null)
      expect(sut.validatedData).toStrictEqual(new UserRules(props))
    })
  })

  describe('createdAt field', () => {
    it('Invalid cases for createdAt field', () => {
      isValid = sut.validate({
        ...UserDataBuilder({}),
        createdAt: '2023' as any,
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])

      isValid = sut.validate({
        ...UserDataBuilder({}),
        createdAt: 10 as any,
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])
    })

    it('Valid case for createdAt field', () => {
      isValid = sut.validate({ ...UserDataBuilder({}), createdAt: null as any })
      expect(isValid).toBeTruthy()
      expect(sut.errors).toStrictEqual(null)
      expect(typeof sut.validatedData['createdAt']).toBe('object')

      const newDate = new Date()
      const props = { ...UserDataBuilder({}), createdAt: newDate }
      isValid = sut.validate(props)
      expect(isValid).toBeTruthy()
      expect(sut.errors).toStrictEqual(null)
      expect(typeof sut.validatedData).toBe('object')
      expect(sut.validatedData['createdAt']).toStrictEqual(props.createdAt)
    })
  })
})
