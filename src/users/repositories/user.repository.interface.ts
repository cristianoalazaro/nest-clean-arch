import { UserEntity } from '../domain/entities/user.entity'
import { SearchableRepositoryInterface } from '@/shared/domain/repositories/searchable-repository-contract'
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from '@/shared/domain/repositories/searchable-repository-contract'

export namespace UserRepositoryInterface {
  export type Filter = string
  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResults extends DefaultSearchResult<UserEntity, Filter> {}

  export interface Repository extends SearchableRepositoryInterface<
    UserEntity,
    Filter,
    SearchParams,
    SearchResults
  > {
    findByEmail(email: string): Promise<UserEntity>
    emailExists(email: string): Promise<void>
  }
}
