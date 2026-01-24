import { instanceToPlain } from 'class-transformer'
import { PaginationPresenter, PaginationPresenterProps } from '../../pagination.presenter'
import { CollectionPresenter } from '../../collection.presenter'

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3, 4]
}

describe('CollectionPresenter unit tests', () => {
  let sut: StubCollectionPresenter

  beforeEach(() => {
    sut = new StubCollectionPresenter({
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
      total: 4,
    })
  })

  it('Should set values', () => {
    expect(sut['paginationPresenter']).toBeInstanceOf(PaginationPresenter)
    expect(sut['paginationPresenter'].currentPage).toBe(1)
    expect(sut['paginationPresenter'].lastPage).toBe(2)
    expect(sut['paginationPresenter'].perPage).toBe(2)
    expect(sut['paginationPresenter'].total).toBe(4)
  })

  it('Should presenter data', () => {
    const output = instanceToPlain(sut)

    expect(output).toStrictEqual({
      data: [1, 2, 3, 4],
      meta: {
        currentPage: 1,
        lastPage: 2,
        perPage: 2,
        total: 4,
      },
    })
  })
})
