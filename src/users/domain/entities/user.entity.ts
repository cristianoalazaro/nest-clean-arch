import { Entity } from '@/shared/domain/entities/entity'

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
    super(props, id)
    props.createdAt = props.createdAt ?? new Date()
  }

  updateName(value: string) {
    this.name = value
  }

  updatePassword(value: string) {
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
}
