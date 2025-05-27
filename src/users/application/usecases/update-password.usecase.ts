import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase as DefaultUseCase } from 'src/shared/application/usecases/use-case'
import { HashProvider } from 'src/shared/application/providers/hash-provider'
import { BadRequestError } from 'src/shared/application/errors/bad-request-error'
import { InvalidPasswordError } from 'src/shared/application/errors/invalid-password-error'

export namespace UpdatePasswordUseCase {
  type Input = {
    id: string
    password: string
    oldPassword: string
  }

  type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<UserOutput> {
      const entity = await this.userRepository.findById(input.id)

      if (!input.password || !input.oldPassword) {
        throw new InvalidPasswordError(
          'Old password and new password is required',
        )
      }

      const checkOldPassword = await this.hashProvider.compareHash(
        entity.password,
        input.oldPassword,
      )

      if (!checkOldPassword) {
        throw new InvalidPasswordError('Old password does not match')
      }

      const hashPassword = await this.hashProvider.generateHash(input.password)

      entity.updatePassword(hashPassword)
      return UserOutputMapper.toOuput(entity)
    }
  }
}
