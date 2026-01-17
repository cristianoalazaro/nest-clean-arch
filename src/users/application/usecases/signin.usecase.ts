import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { InvalidCredentialError } from '@/shared/application/errors/invalid-credential-error'

export namespace SigninUseCase {
  export type Input = {
    email: string
    password: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepositoryInterface.Repository,
      private hashProvider: HashProvider,
    ) {}
    async execute(input: Input): Promise<Output> {
      const { email, password } = input

      if (!email || !password) {
        throw new BadRequestError('Input data not provided!')
      }

      const entity = await this.userRepository.findByEmail(email)

      const isValidPassword = await this.hashProvider.compareHash(password, entity.password)

      if (!isValidPassword) {
        throw new InvalidCredentialError('Invalid password!')
      }

      return UserOutputMapper.toOutput(entity)
    }
  }
}
