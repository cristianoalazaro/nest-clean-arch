import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

export namespace DeleteUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepositoryInterface.Repository) {}
    async execute(input: Input): Promise<Output> {
      if (!input.id) {
        throw new BadRequestError('Id not provided!')
      }

      const entity = await this.userRepository.findById(input.id)

      await this.userRepository.delete(input.id)
    }
  }
}
