import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { BcryptHashProvider } from '@/users/infrastructure/providers/hashProvider/bcryptjs-hash.provider'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

export namespace UpdatePasswordUserUseCase {
  export type Input = {
    id: string
    password: string
    oldPassword: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepositoryInterface.Repository,
      private hashProvider: BcryptHashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.password || !input.oldPassword) {
        throw new BadRequestError('Old password and new password is required!')
      }

      const entity = await this.userRepository.findById(input.id)

      const isValidPassword = await this.hashProvider.compareHash(
        input.oldPassword,
        entity.password,
      )

      if (!isValidPassword) {
        throw new InvalidPasswordError('Password is invalid!')
      }

      const hash = await this.hashProvider.generateHash(input.password)
      entity.updatePassword(hash)

      await this.userRepository.update(entity)
      return UserOutputMapper.toOutput(entity)
    }
  }
}
