import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubRules {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  constructor(data: any) {
    Object.assign(this, data)
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data))
  }
}

describe('ClassValidatorFields integrtion tests', () => {
  let validator: StubClassValidatorFields

  beforeEach(() => {
    validator = new StubClassValidatorFields()
  })

  it('Should validate with errors', () => {
    expect(validator.validate(null)).toBeFalsy()
    expect(validator.errors).toStrictEqual({
      name: [
        'name must be shorter than or equal to 255 characters',
        'name should not be empty',
        'name must be a string',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    })
    expect(validator.validatedData).toBeNull()
  })

  it('Should validate without errors', () => {
    expect(
      validator.validate(new StubRules({ name: 'Test', price: 100 })),
    ).toBeTruthy()
    expect(validator.errors).toBeNull()
    expect(validator.validatedData).toStrictEqual(
      new StubRules({ name: 'Test', price: 100 }),
    )
  })
})
