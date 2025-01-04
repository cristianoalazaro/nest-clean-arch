import { ClassValidatorFields } from '../../class-validator-fields'
import * as libClassValidator from 'class-validator'

class StubClassValidatorTest extends ClassValidatorFields<{ field: string }> {}

describe('ClassValidatorTest unit tests', () => {
  it('Should initialize errors and validatedData with null', () => {
    const sut = new StubClassValidatorTest()

    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toBeNull()
  })

  it('Should validate with error', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')

    spyValidateSync.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'test error' } },
    ])

    const sut = new StubClassValidatorTest()

    expect(sut.validate(null)).toBeFalsy()
    expect(sut.errors).not.toBeNull()
    expect(sut.validatedData).toBeNull()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(sut.errors).toStrictEqual({ field: ['test error'] })
  })

  it('Should validate without error', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')
    spyValidateSync.mockReturnValue([])

    const sut = new StubClassValidatorTest()

    expect(sut.validate({ name: 'Teste' })).toBeTruthy()
    expect(sut.errors).toBeNull()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(sut.validatedData).toStrictEqual({ name: 'Teste' })
  })
})
