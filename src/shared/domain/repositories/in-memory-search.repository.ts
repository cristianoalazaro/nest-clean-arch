import { Entity } from '../entities/entity'
import { InMemoryRepository } from './in-memory.repository'
import { SearchableRepositoryInterface } from './searchable-repository-contract'

export class SearchInput {
  filter: any
}

export class SearchOutput {
  pages: number
}

export abstract class InMemorySearchRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, SearchInput, SearchOutput>
{
  search(props: SearchInput): Promise<SearchOutput> {
    throw new Error('Method not implemented.')
  }
}
