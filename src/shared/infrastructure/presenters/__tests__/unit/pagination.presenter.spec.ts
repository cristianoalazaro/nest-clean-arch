import { instanceToPlain } from 'class-transformer'
import { PaginationPresenter, PaginationPresenterProps } from '../../pagination.presenter'

describe('PaginationPresenter unit tests', () => {
  let sut: PaginationPresenter

  describe('Constructor', () => {
    it('Should set values', () => {
      sut = new PaginationPresenter({
        currentPage: 1,
        lastPage: 2,
        perPage: 3,
        total: 4,
      })

      expect(sut.currentPage).toEqual(1)
      expect(sut.lastPage).toEqual(2)
      expect(sut.perPage).toEqual(3)
      expect(sut.total).toEqual(4)
    })

    it('Should set string values', () => {
      sut = new PaginationPresenter({
        currentPage: '1' as any,
        lastPage: '2' as any,
        perPage: '3' as any,
        total: '4' as any,
      })

      expect(sut.currentPage).toEqual('1')
      expect(sut.lastPage).toEqual('2')
      expect(sut.perPage).toEqual('3')
      expect(sut.total).toEqual('4')
    })
  })

  describe('Pagination Presenter data', () => {
    it('Should presenter data', () => {
      sut = new PaginationPresenter({
        currentPage: 1,
        lastPage: 2,
        perPage: 3,
        total: 4,
      })

      let output = instanceToPlain(sut)

      expect(output).toEqual({
        currentPage: 1,
        lastPage: 2,
        perPage: 3,
        total: 4,
      })

      sut = new PaginationPresenter({
        currentPage: '1' as any,
        lastPage: '2' as any,
        perPage: '3' as any,
        total: '4' as any,
      })

      output = instanceToPlain(sut)

      expect(output).toEqual({
        currentPage: 1,
        lastPage: 2,
        perPage: 3,
        total: 4,
      })
    })
  })
})
