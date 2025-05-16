import { SortDirection } from 'src/shared/infrastructure/domain/repositories/searchable-repository-contract'

export type SearchInput<Filter = string> = {
  page?: number
  perPage?: number
  sort?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}
