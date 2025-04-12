import { validateSync } from 'class-validator'
import {
  ErrorFields,
  ValidatorFieldsInterface,
} from './validator-fields.interface'

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: ErrorFields = {}
  validatedData: PropsValidated

  validate(data: any): boolean {
    const errors = validateSync(data)

    if (errors.length) {
      this.errors = {}

      for (const error of errors) {
        const field = error.property

        if (error.constraints) {
          this.errors[field] = Object.values(error.constraints)
        }
      }
    } else {
      this.validatedData = data
    }

    return !errors.length
  }
}
