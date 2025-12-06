export type UserProps = {
  name: string
  email: string
  password: string
  createdAt?: Date
}

export class UserEntity {
  constructor(public readonly props: UserProps) {
    props.createdAt = props.createdAt ?? new Date()
  }

  get name() {
    return this.name
  }

  get email() {
    return this.email
  }

  get password() {
    return this.password
  }

  get createdAt() {
    return this.createdAt
  }
}
