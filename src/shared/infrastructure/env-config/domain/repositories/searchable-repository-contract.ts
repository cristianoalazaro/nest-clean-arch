import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contract'

type SortDirection = 'asc' | 'desc'

type SearchProps<Filter = string> = {
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
  protected _filter: string | null

  constructor(props: SearchProps) {
    this._page = props.page ?? 1
    this._perPage = props.perPage ?? this._perPage
    this._sort = props.sort ?? null
    this._sortDir = props.sortDir ?? null
    this._filter = props.filter ?? null
  }

  get page() {
    return this._page
  }

  private set page(value: number) {
    let _page = +value

    if (!Number.isNaN(_page) || _page <= 0) {
      this._page = 1
    }

    this._page = value
  }

  get perPage() {
    return this._perPage
  }

  private set perPage(value: number) {
    let _perPage = +value

    if (!Number.isNaN(_perPage) || _perPage <= 0) {
      this._perPage = this._perPage
    }

    this._perPage = value
  }

  get sort(): string | null {
    return this._sort
  }

  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`
  }

  get sortDir(): string | null {
    return this._sortDir
  }

  private set sortDir(value: string | null) {
    if (!value) {
      this._sortDir = null
      return
    }

    const dir = `${value.toLowerCase()}`
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir
  }

  get filter(): string | null {
    return this._filter
  }

  private set filter(value: string | null) {
    this._filter =
      value === null || value === undefined || value === '' ? null : `${value}`
  }
}

export interface SearchableRepository<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchParams): Promise<SearchOutput>
}
