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
  protected _perPage: number
  protected _sort: string | null
  protected _sortDir: SortDirection | null
  protected _filter: string | null

  constructor(props: SearchProps) {
    this._page = props.page ?? 1
    this._perPage = props.perPage ?? 15
    this._sort = props.sort ?? null
    this._sortDir = props.sortDir ?? null
    this._filter = props.filter ?? null
  }

  get page() {
    return this._page
  }

  private set page(value: number) {
    this._page = value
  }

  get perPage() {
    return this._perPage
  }

  private set perPage(value: number) {
    this._perPage = value
  }

  get sort(): string | null {
    return this._sort
  }

  private set sort(value: string | null) {
    this._sort = value
  }
  get sortDir(): string | null {
    return this._sortDir
  }

  private set sortDir(value: SortDirection | null) {
    this._sortDir = value
  }

  get filter(): string | null {
    return this._filter
  }

  private set filter(value: string | null) {
    this._filter = value
  }
}

export interface SearchableRepository<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchParams): Promise<SearchOutput>
}
