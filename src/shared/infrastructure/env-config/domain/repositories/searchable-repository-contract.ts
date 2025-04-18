import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contract'

export interface SearchableRepository<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchInput): Promise<SearchOutput>
}
