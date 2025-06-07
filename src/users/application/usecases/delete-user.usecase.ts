import { UseCase as DefaultUseCase } from 'src/shared/application/usecases/use-case'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { BadRequestError } from 'src/shared/application/errors/bad-request-error'

export namespace DeleteUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.id) {
        throw new BadRequestError('Id not provided')
      }

      await this.userRepository.delete(input.id)
    }
  }
}
