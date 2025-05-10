import { UserEntity } from 'src/users/domain/entities/user.entity'
import { BadRequestError } from '../errors/bad-request-error'
import { UserRepository } from 'src/users/domain/repositories/user.repository'

export namespace SignupUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = {
    id: string
    name: string
    email: string
    password: string
    createdAt: Date
  }

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input
      if (!name || !email || !password) {
        throw new BadRequestError('Input data not provided')
      }

      const entity = new UserEntity(input)
      await this.userRepository.emailExists(email)
      return entity.toJson()
    }
  }
}
