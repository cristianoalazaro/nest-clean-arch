export type ErrorFields = {
  [field: string]: string[]
}

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: ErrorFields
  validatedData: PropsValidated
  validate(data: any): boolean
}
