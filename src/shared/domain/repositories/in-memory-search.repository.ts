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
    const filteredItems = await this.applyFilter(this.items, props.filter)

    const sortedItems = await this.applySort(
      filteredItems,
      props.sort,
      props.sortDir,
    )

    const paginatedItems = await this.applyPagination(
      sortedItems,
      props.page,
      props.perPage,
    )

    return new SearchResult({
      items: paginatedItems,
      total: paginatedItems.length,
      currentPage: props.page,
      perPage: props.perPage,
      filter: props.filter,
      sort: props.sort,
      sortDir: props.sortDir,
    })
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
