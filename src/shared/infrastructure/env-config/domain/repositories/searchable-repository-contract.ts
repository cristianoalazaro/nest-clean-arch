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
  protected _perPage: number = 15
  protected _sort: string | null
  protected _sortDir: string | null
  protected _filter: string | null

  constructor(props: SearchProps = {}) {
    this.page = props.page ?? 1
    this.perPage = props.perPage ?? 15
    this.sort = props.sort ?? null
    this.sortDir = props.sortDir ?? null
    this.filter = props.filter ?? null
  }

  get page() {
    return this._page
  }

  private set page(value: number) {
    let _page = Number(value)

    this._page =
      Number.isNaN(_page) || !Number.isInteger(_page) || _page <= 0 ? 1 : _page
  }

  get perPage() {
    return this._perPage
  }

  private set perPage(value: number) {
    let _perPage = value === (true as any) ? 15 : Number(value)

    this._perPage =
      Number.isNaN(_perPage) || !Number.isInteger(_perPage) || _perPage <= 0
        ? 15
        : _perPage
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
    if (!this.sort) {
      this._sortDir = null
      return
    }

    const dir = `${value}`.toLowerCase()
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
