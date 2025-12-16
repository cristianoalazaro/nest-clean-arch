import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { SearchInput } from '@/shared/application/dtos/search-input'
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'

export namespace ListUserUseCase {
  export type Input = SearchInput
  export type Output = PaginationOutput<UserOutput>

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepositoryInterface.Repository) {}
    async execute(input: Input): Promise<Output> {
      const params = new UserRepositoryInterface.SearchParams(input)
      const searchResult = await this.userRepository.search(params)
      return this.toOutput(searchResult)
    }

    toOutput(searchResult: UserRepositoryInterface.SearchResults): Output {
      const items = searchResult.items.map(item => UserOutputMapper.toOutput(item))
      return PaginationOutputMapper.toOutput(items, searchResult) as Output
    }
  }
}
