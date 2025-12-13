import { Entity } from '../entities/entity'
import { InMemoryRepository } from './in-memory.repository'
import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from './searchable-repository-contract'

export abstract class InMemorySearchRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  async search(props: SearchParams): Promise<SearchResult<E>> {
    throw new Error('Method not implemented.')
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<E[]> {}

  protected async applyPagination(
    items: E[],
    page: SearchParams['_page'],
    perPage: SearchParams['_perPage'],
  ): Promise<E[]> {}
}
