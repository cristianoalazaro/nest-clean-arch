import { SearchInput } from 'src/shared/application/dtos/search-input'
import { UseCase as DefaultUseCase } from 'src/shared/application/usecases/use-case'
import { SearchParams } from 'src/shared/infrastructure/domain/repositories/searchable-repository-contract'
import { UserRepository } from 'src/users/domain/repositories/user.repository'

export namespace ListUsersUseCase {
  type Input = SearchInput
  type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const paramns = new SearchParams(input)
      const searchResult = await this.userRepository.search(paramns)
      return
    }
  }
}
