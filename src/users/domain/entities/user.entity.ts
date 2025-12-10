import { Entity } from '@/shared/domain/entities/entity'
import { UserValidatorFactory } from '../validators/userValidator'

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
    props.createdAt = props.createdAt ?? new Date()
  }

  updateName(value: string) {
    UserEntity.validate({ ...this.props, name: value })
    this.name = value
  }

  updatePassword(value: string) {
    UserEntity.validate({ ...this.props, password: value })
    this.password = value
  }

  get name() {
    return this.name
  }

  private set name(value) {
    this.props.name = value
  }

  get email() {
    return this.email
  }

  get password() {
    return this.password
  }

  private set password(value) {
    this.props.password = value
  }

  get createdAt() {
    return this.createdAt
  }

  static validate(data: UserProps) {
    const validator = UserValidatorFactory.create()
    validator.validate(data)
  }
}
