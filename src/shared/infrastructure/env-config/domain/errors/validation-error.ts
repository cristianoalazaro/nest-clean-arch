import { ErrorFields } from '../validators/validator-fields.interface'

export class ValidationError extends Error {}

export class EntityValidationError extends Error {
  constructor(public error: ErrorFields) {
    super('Entity Validation Error')
    this.name = 'EntityValidationError'
  }
}
