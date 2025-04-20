import { SearchParams } from '../../searchable-repository-contract'

describe('Searchable Repository unit tests', () => {
  describe('Search Params', () => {
    let sut: SearchParams

    it('Page prop', () => {
      sut = new SearchParams()
      expect(sut.page).toBe(1)

      const params = [
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
        { page: '', expected: 1 },
        { page: 'test', expected: 1 },
        { page: '1', expected: 1 },
        { page: 0, expected: 1 },
        { page: -10, expected: 1 },
        { page: 5.5, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 2, expected: 2 },
      ]

      params.forEach(param => {
        expect(new SearchParams({ page: param.page as any }).page).toBe(
          param.expected,
        )
      })
    })

    it('PerPage prop', () => {
      sut = new SearchParams()
      expect(sut.perPage).toBe(15)

      const params = [
        { perPage: null, expected: 15 },
        { perPage: undefined, expected: 15 },
        { perPage: '', expected: 15 },
        { perPage: 'test', expected: 15 },
        { perPage: '10', expected: 10 },
        { perPage: 0, expected: 15 },
        { perPage: -10, expected: 15 },
        { perPage: 5.5, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: 20, expected: 20 },
      ]

      params.forEach(param => {
        expect(
          new SearchParams({ perPage: param.perPage as any }).perPage,
        ).toBe(param.expected)
      })
    })

    it('Sort prop', () => {
      sut = new SearchParams()
      expect(sut.sort).toBeNull()

      const params = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: '', expected: null },
        { sort: 'test', expected: 'test' },
        { sort: '10', expected: '10' },
        { sort: 0, expected: '0' },
        { sort: -10, expected: '-10' },
        { sort: 5.5, expected: '5.5' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
        { sort: 20, expected: '20' },
      ]

      params.forEach(param => {
        expect(new SearchParams({ sort: param.sort as any }).sort).toBe(
          param.expected,
        )
      })
    })

    it('SortDir prop', () => {
      sut = new SearchParams()
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: null })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: undefined })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: '' })
      expect(sut.sortDir).toBeNull()

      const params = [
        { sortDir: null, expected: 'desc' },
        { sortDir: undefined, expected: 'desc' },
        { sortDir: '', expected: 'desc' },
        { sortDir: 'test', expected: 'desc' },
        { sortDir: '10', expected: 'desc' },
        { sortDir: 0, expected: 'desc' },
        { sortDir: true, expected: 'desc' },
        { sortDir: false, expected: 'desc' },
        { sortDir: {}, expected: 'desc' },
        { sortDir: 'asc', expected: 'asc' },
        { sortDir: 'desc', expected: 'desc' },
        { sortDir: 'ASC', expected: 'asc' },
        { sortDir: 'DESC', expected: 'desc' },
      ]

      params.forEach(param => {
        expect(
          new SearchParams({ sort: 'field', sortDir: param.sortDir as any })
            .sortDir,
        ).toBe(param.expected)
      })
    })

    it('Filter prop', () => {
      sut = new SearchParams()
      expect(sut.filter).toBeNull()

      const params = [
        { filter: null, expected: null },
        { filter: undefined, expected: null },
        { filter: '', expected: null },
        { filter: 'test', expected: 'test' },
        { filter: '10', expected: '10' },
        { filter: 0, expected: '0' },
        { filter: -10, expected: '-10' },
        { filter: 5.5, expected: '5.5' },
        { filter: true, expected: 'true' },
        { filter: false, expected: 'false' },
        { filter: {}, expected: '[object Object]' },
        { filter: 20, expected: '20' },
      ]

      params.forEach(param => {
        expect(new SearchParams({ filter: param.filter as any }).filter).toBe(
          param.expected,
        )
      })
    })
  })
})
