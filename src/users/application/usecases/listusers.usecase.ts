import {
  PaginationOutput,
  PaginationOutputMapper,
} from 'src/shared/application/dtos/pagination-output'
import { SearchInput } from 'src/shared/application/dtos/search-input'
import { UseCase as DefaultUseCase } from 'src/shared/application/usecases/use-case'
import { SearchParams } from 'src/shared/infrastructure/domain/repositories/searchable-repository-contract'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'

export namespace ListUsersUseCase {
  export type Input = SearchInput
  export type Output = PaginationOutput<UserOutput>

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const paramns = new SearchParams(input)
      const searchResult = await this.userRepository.search(paramns)
      return this.toOutput(searchResult)
    }

    private toOutput(searchResult: UserRepository.SearchResult): Output {
      const items = searchResult.items.map(item =>
        UserOutputMapper.toOuput(item),
      )
      return PaginationOutputMapper.toOutput(items, searchResult)
    }
  }
}
