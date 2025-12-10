import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubRules {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  constructor(data: any) {
    Object.assign(this, data)
  }
}

class StubValidator extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data))
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('Should validate with errors', () => {
    const validator = new StubValidator()

    expect(validator.validate(null)).toBeFalsy()
    expect(validator.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    })
  })

  it('Should validate without errors', () => {
    const validator = new StubValidator()

    expect(validator.validate({ name: 'Test Name', price: 100.0 })).toBeTruthy()
    expect(validator.errors).toBeNull()
    expect(validator.validatedData).toStrictEqual(
      new StubRules({
        name: 'Test Name',
        price: 100,
      }),
    )
  })
})
