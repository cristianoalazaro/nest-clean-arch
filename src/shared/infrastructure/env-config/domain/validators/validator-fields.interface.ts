export type ErrorFields = {
  [field: string]: string[]
}

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: ErrorFields | null
  validatedData: PropsValidated | null
  validate(data: any): boolean
}
