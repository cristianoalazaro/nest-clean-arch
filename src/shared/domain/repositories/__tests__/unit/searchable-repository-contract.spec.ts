import { SearchParams } from '../../searchable-repository-contract'

describe('Searchable Repository unit tests', () => {
  describe('SearchParams', () => {
    let sut: SearchParams

    it('page prop', () => {
      const params = [
        { page: null as any, expected: 1 },
        { page: undefined as any, expected: 1 },
        { page: '', expected: 1 },
        { page: 'test', expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.5, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ]

      params.forEach(i => {
        expect(new SearchParams({ page: i.page }).page).toBe(i.expected)
      })
    })

    it('perPage prop', () => {
      const params = [
        { perPage: null as any, expected: 15 },
        { perPage: undefined as any, expected: 15 },
        { perPage: '', expected: 15 },
        { perPage: 'test', expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: -1, expected: 15 },
        { perPage: 5.5, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: 2, expected: 2 },
        { perPage: 15, expected: 15 },
      ]

      params.forEach(i => {
        expect(new SearchParams({ perPage: i.perPage }).perPage).toBe(
          i.expected,
        )
      })
    })

    it('sort prop', () => {
      const params = [
        { sort: null, expected: null },
        { sort: undefined as any, expected: null },
        { sort: '', expected: null },
        { sort: 'test', expected: 'test' },
        { sort: 0, expected: '0' },
        { sort: -1, expected: '-1' },
        { sort: 5.5, expected: '5.5' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
        { sort: 2, expected: '2' },
        { sort: 15, expected: '15' },
      ]

      params.forEach(i => {
        expect(new SearchParams({ sort: i.sort }).sort).toBe(i.expected)
      })
    })

    it('sortDir prop', () => {
      expect(new SearchParams({ sort: null }).sortDir).toBeNull()
      expect(new SearchParams({ sort: undefined }).sortDir).toBeNull()
      expect(new SearchParams({ sort: '' }).sortDir).toBeNull()

      const params = [
        { sortDir: null, expected: 'desc' },
        { sortDir: undefined as any, expected: 'desc' },
        { sortDir: '', expected: 'desc' },
        { sortDir: 'test', expected: 'desc' },
        { sortDir: 0, expected: 'desc' },
        { sortDir: 15, expected: 'desc' },
        { sortDir: 'DESC', expected: 'desc' },
        { sortDir: 'ASC', expected: 'asc' },
        { sortDir: 'asc', expected: 'asc' },
        { sortDir: 'desc', expected: 'desc' },
      ]

      params.forEach(i => {
        expect(
          new SearchParams({ sort: 'field', sortDir: i.sortDir }).sortDir,
        ).toBe(i.expected)
      })
    })

    it('filter prop', () => {
      const params = [
        { filter: null, expected: null },
        { filter: undefined as any, expected: null },
        { filter: '', expected: null },
        { filter: 'test', expected: 'test' },
        { filter: 0, expected: '0' },
        { filter: -1, expected: '-1' },
        { filter: 5.5, expected: '5.5' },
        { filter: true, expected: 'true' },
        { filter: false, expected: 'false' },
        { filter: {}, expected: '[object Object]' },
        { filter: 2, expected: '2' },
        { filter: 15, expected: '15' },
      ]

      params.forEach(i => {
        expect(new SearchParams({ filter: i.filter }).filter).toBe(i.expected)
      })
    })
  })
})
