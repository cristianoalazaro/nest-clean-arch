import { Entity } from '@/shared/domain/entities/entity'
import { UserValidatorFactory } from '@/users/validators/user.validator'
import { EntityValidationError } from '../errors/validation-error'

export type UserProps = {
  name: string
  email: string
  password: string
  createdAt?: Date
}

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    UserEntity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
  }

  updateName(value: string): void {
    UserEntity.validate({ ...this.props, name: value })
    this.name = value
  }

  updatePassword(value: string): void {
    UserEntity.validate({ ...this.props, password: value })
    this.password = value
  }

  get name() {
    return this.name
  }

  private set name(value: string) {
    this.props.name = value
  }

  get email() {
    return this.email
  }

  get password() {
    return this.password
  }

  private set password(value: string) {
    this.props.password = value
  }

  get createdAt() {
    return this.createdAt
  }

  static validate(props: UserProps) {
    const validator = UserValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }
}
