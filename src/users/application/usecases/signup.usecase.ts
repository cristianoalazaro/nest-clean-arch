import { UserEntity } from 'src/users/domain/entities/user.entity'
import { BadRequestError } from '../errors/bad-request-error'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { BcryptjsHashProvider } from 'src/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'

export namespace SignUpUseCase {
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
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: BcryptjsHashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input
      if (!name || !email || !password) {
        throw new BadRequestError('Input data not provided')
      }

      await this.userRepository.emailExists(email)

      const hashPassword = await this.hashProvider.generateHash(password)

      const entity = new UserEntity({ ...input, password: hashPassword })

      await this.userRepository.insert(entity)

      return entity.toJson()
    }
  }
}
