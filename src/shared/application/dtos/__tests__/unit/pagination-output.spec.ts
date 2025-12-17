import { PaginationOutputMapper } from '../../pagination-output'
import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contract'

describe('PaginationOutputMapper unit tests', () => {
  it('Should convert a SearchResult to UserOutput', () => {
    const searchResult = new SearchResult({
      items: ['fake'] as any,
      currentPage: 1,
      perPage: 1,
      filter: null,
      sort: null,
      sortDir: null,
      total: 1,
    })

    const sut = PaginationOutputMapper.toOutput(searchResult.items, searchResult as any)
    expect(sut).toStrictEqual({
      items: sut.items,
      total: sut.total,
      currentPage: sut.currentPage,
      lastPage: sut.lastPage,
      perPage: sut.perPage,
    })
  })
})
