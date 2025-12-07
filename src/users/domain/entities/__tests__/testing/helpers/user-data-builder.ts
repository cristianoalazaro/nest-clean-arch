import { faker } from '@faker-js/faker'
import { UserProps } from '../../../user.entity'

type Props = {
  name?: string
  email?: string
  passsword?: string
  createdAt?: Date
}

export const UserDataBuilder = (props: Props): UserProps => {
  return {
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.passsword ?? faker.internet.password(),
    createdAt: props.createdAt ?? new Date(),
  }
}
