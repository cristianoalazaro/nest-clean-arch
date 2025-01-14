import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contracts'

export type SortDirection = 'asc' | 'desc'

export type SearchProps<Filter = string> = {
  page?: number
  perPage?: number
  sort?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}

export class SearchParams {
  protected _page: number
  protected _perPage = 15
  protected _sort: string | null
  protected _sortDir: SortDirection | null
  protected _filter: string

  constructor(props: SearchProps) {
    this._page = props.page
    this._perPage = props.perPage
    this._sort = props.sort
    this._sortDir = props.sortDir
    this._filter = props.filter
  }

  //getters and setters
  getPage() {
    return this._page
  }

  private setPage(value: number) {
    let _page = +value
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1
    }
    this._page = _page
  }

  getPerPage() {
    return this._perPage
  }

  private setPerPage(value: number) {
    let _perPage = +value
    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = 1
    }
    this._perPage = _perPage
  }

  getSort() {
    return this._sort
  }

  private setSort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`
  }

  getSortDir() {
    return this._sortDir
  }

  private setSortDir(value: SortDirection) {
    if (!this._sort) {
      this._sortDir = null
      return
    }

    const dir = `${value}`.toLowerCase()
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir
  }

  getFilter() {
    return this._filter
  }

  private setFilter(value: string) {
    this._filter =
      value === null || value === undefined || value === '' ? null : `${value}`
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchInput): Promise<SearchOutput>
}
