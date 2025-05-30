import { UserProps } from '../../entities/user.entity'
import { faker } from '@faker-js/faker'

type Props = {
  name?: string
  email?: string
  password?: string
  createdAt?: Date
}

export const UserDataBuilder = (props: Props): UserProps => {
  return {
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    createdAt: props.createdAt ?? new Date(),
  }
}
