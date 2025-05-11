import { UserEntity } from 'src/users/domain/entities/user.entity'
import { BadRequestError } from '../errors/bad-request-error'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { BcryptjsHashProvider } from 'src/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UserOutput } from '../dtos/user-output'

export namespace GetUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = UserOutput

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)
      return entity.toJson()
    }
  }
}
