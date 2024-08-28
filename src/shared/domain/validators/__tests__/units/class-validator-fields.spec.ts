import { ClassValidatorFields } from '../../class-validator-fields'
import * as libClassValidator from 'class-validator'

describe('ClassValidatorFields unit tests', () => {
  class StubClassValidatorFields extends ClassValidatorFields<{
    field: string
  }> {}

  it('should initialize errors and validatedData with null', () => {
    const sut = new StubClassValidatorFields()

    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toBeNull()
  })

  it('should validate with errors', () => {
    const spyValidadeSync = jest.spyOn(libClassValidator, 'validateSync')
    spyValidadeSync.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'test error' } },
    ])

    const sut = new StubClassValidatorFields()

    expect(sut.validate(null)).toBeFalsy()
    expect(sut.errors).not.toBeNull()
    expect(sut.validatedData).toBeNull()
    expect(spyValidadeSync).toHaveBeenCalled()
    expect(sut.errors).toStrictEqual({ field: ['test error'] })
  })
})
