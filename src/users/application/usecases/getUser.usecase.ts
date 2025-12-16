import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { BadRequestError } from '../errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { HashProvider } from '@/shared/application/providers/hash.provider'

export namespace GetUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = {
    id: string
    name: string
    email: string
    password: string
    createdAt: Date
  }

  export class UseCase {
    constructor(private userRepository: UserRepositoryInterface.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)
      return entity.toJSON()
    }
  }
}
