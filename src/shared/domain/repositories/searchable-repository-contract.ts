import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contract'

type SortOrder = 'asc' | 'desc'

type SearchProps<Filter = string> = {
  page?: number
  perPage?: number
  sort?: string
  sortDir?: SortOrder
  filter?: Filter
}

export class SearchParams {
  protected _page: number
  protected _perPage = 15
  protected _sort: string | null
  protected _sortDir: SortOrder | null
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

  private set page(value: number) {}

  get perPage() {
    return this._perPage
  }

  private set perPage(value: number) {}

  get sort(): string | null {
    return this._sort
  }

  private set sort(value: string) {}

  get sortDir(): SortOrder {
    return this._sortDir ?? 'desc'
  }

  private set sortDir(value: SortOrder) {}

  get filter(): string | null {
    return this._filter
  }

  private set filter(value: string) {}
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchInput): Promise<SearchOutput>
}
