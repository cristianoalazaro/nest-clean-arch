import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contract'
import { ListUserUseCase } from '@/users/application/usecases/listUser.usecase'

export class ListUsersDto implements ListUserUseCase.Input {
  page?: number
  perPage?: number
  sort?: string | null
  sortDir?: SortDirection | null
  filter?: string
}
