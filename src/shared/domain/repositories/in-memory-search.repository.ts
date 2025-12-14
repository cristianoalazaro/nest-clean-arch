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
  sortableFields: string[] = []

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
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items
    }

    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sortDir === 'asc' ? -1 : 1
      }
      if (a.props[sort] > b.props[sort]) {
        return sortDir === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  protected async applyPagination(
    items: E[],
    page: SearchParams['_page'],
    perPage: SearchParams['_perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage
    const limit = page - 1 + perPage
    return items.slice(start, limit)
  }
}
