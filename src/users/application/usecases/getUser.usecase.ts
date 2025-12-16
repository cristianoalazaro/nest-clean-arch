import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { UserOutput } from '../dtos/user-output'

export namespace GetUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = UserOutput

  export class UseCase {
    constructor(private userRepository: UserRepositoryInterface.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)
      return entity.toJSON()
    }
  }
}
