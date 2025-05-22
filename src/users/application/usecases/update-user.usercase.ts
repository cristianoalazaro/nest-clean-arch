import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase as DefaultUsecase } from 'src/shared/application/usecases/use-case'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { BadRequestError } from 'src/shared/application/errors/bad-request-error'

export namespace UpdateUserUseCase {
  export type Input = {
    id: string
    name: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUsecase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<UserOutput> {
      if (!input.name) {
        throw new BadRequestError('Name not provided')
      }

      const entity = await this.userRepository.findById(input.id)
      entity.updateName(input.name)
      await this.userRepository.update(entity)
      return UserOutputMapper.toOuput(entity)
    }
  }
}
