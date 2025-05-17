import { SearchResult } from 'src/shared/infrastructure/domain/repositories/searchable-repository-contract'
import { PaginationOutputMapper } from '../../pagination-output'

describe('PaginationOutputMapper unit tests', () => {
  it('Should convert a SearchResult in output', async () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      currentPage: 1,
      perPage: 1,
      total: 1,
      sort: '',
      sortDir: '',
      filter: 'fake',
    })

    const sut = PaginationOutputMapper.toOutput(result.items, result)

    expect(sut).toStrictEqual({
      items: ['fake'],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    })
  })
})
