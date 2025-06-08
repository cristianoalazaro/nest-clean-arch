import { UseCase as DefaultUseCase } from 'src/shared/application/usecases/use-case'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { BadRequestError } from 'src/shared/application/errors/bad-request-error'
import { UserInMemoryRepository } from 'src/users/infrastructure/database/in-memory/repositories/user-in-memory-repository'
import { HashProvider } from 'src/shared/application/providers/hash-provider'
import { InvalidCredentialError } from 'src/shared/application/errors/invalid-credential-error'
import { UserRepository } from 'src/users/domain/repositories/user.repository'

export namespace SignInUseCase {
  export type Input = {
    email: string
    password: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly userRepository: UserRepository.Repository,
      private readonly hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<UserOutput> {
      const { email, password } = input

      if (!email || !password) {
        throw new BadRequestError('Input data not provided')
      }

      const entity = await this.userRepository.findByEmail(email)

      const hashPasswordMatches = await this.hashProvider.compareHash(
        password,
        entity.password,
      )

      if (!hashPasswordMatches) {
        throw new InvalidCredentialError('Invalid credentials')
      }

      return UserOutputMapper.toOuput(entity)
    }
  }
}
