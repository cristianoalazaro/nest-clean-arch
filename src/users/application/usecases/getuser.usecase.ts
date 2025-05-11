import { UserEntity } from 'src/users/domain/entities/user.entity'
import { BadRequestError } from '../errors/bad-request-error'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { BcryptjsHashProvider } from 'src/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'

export namespace GetUserUseCase {
  export type Input = {
    id: string
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
      const entity = await this.userRepository.findById(input.id)
      return entity.toJson()
    }
  }
}
