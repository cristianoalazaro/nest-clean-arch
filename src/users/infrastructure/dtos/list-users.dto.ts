import { SortDirection } from 'src/shared/infrastructure/domain/repositories/searchable-repository-contract'
import { ListUsersUseCase } from 'src/users/application/usecases/listusers.usecase'

export class ListUsersDto implements ListUsersUseCase.Input {
  page?: number
  perPage?: number
  sort?: string
  sortDir?: SortDirection
  filter?: string
}
