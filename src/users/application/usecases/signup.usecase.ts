import { UserEntity } from 'src/users/domain/entities/user.entity'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { BcryptjsHashProvider } from 'src/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UserOutput } from '../dtos/user-output'
import { UseCase as DefaultUseCase } from 'src/shared/application/usecases/use-case'

export namespace SignUpUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
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
