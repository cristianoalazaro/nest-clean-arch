import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-buil'
import { UserRules, UserValidator, UserValidatorFactory } from '../user.validator'

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

    it('Valid cases for name field', () => {
      const props = UserDataBuilder({})
      const isValid = sut.validate(props)
      expect(isValid).toBeTruthy()
      expect(sut.validatedData).toStrictEqual(new UserRules(props))
    })
  })
})
