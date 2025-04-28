import { Entity } from '../../../entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'
import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contract'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name']

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items
    }

    return items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository()
  })

  describe('ApplyFilter method', () => {
    it('Should no filter items when filter params is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 50 })]
      const spyOnFilter = jest.spyOn(items, 'filter')
      const itemsFiltered = await sut['applyFilter'](items, null)

      expect(itemsFiltered).toStrictEqual(items)
      expect(spyOnFilter).not.toHaveBeenCalled()
    })

    it('Should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'fake', price: 50 }),
      ]

      const spyOnFilter = jest.spyOn(items, 'filter')

      let filteredItems = await sut['applyFilter'](items, 'TEST')
      expect(filteredItems).toStrictEqual([items[0], items[1]])
      expect(spyOnFilter).toHaveBeenCalledTimes(1)

      filteredItems = await sut['applyFilter'](items, 'test')
      expect(filteredItems).toStrictEqual([items[0], items[1]])
      expect(spyOnFilter).toHaveBeenCalledTimes(2)

      filteredItems = await sut['applyFilter'](items, 'other')
      expect(filteredItems).toHaveLength(0)
      expect(spyOnFilter).toHaveBeenCalledTimes(3)
    })
  })

  describe('ApplySort method', () => {
    it('Should no sort items', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'fake', price: 50 }),
      ]

      let sortedItems = await sut['applySort'](items, null, null)
      expect(sortedItems).toStrictEqual(items)

      sortedItems = await sut['applySort'](items, 'price', 'asc')
      expect(sortedItems).toStrictEqual(items)
    })

    it('Should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
      ]

      let sortedItems = await sut['applySort'](items, 'name', null)
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]])

      sortedItems = await sut['applySort'](items, 'name', 'desc')
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]])

      sortedItems = await sut['applySort'](items, 'name', 'asc')
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]])
    })
  })

  describe('ApplyPaginate method', () => {
    it('Should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
        new StubEntity({ name: 'd', price: 50 }),
        new StubEntity({ name: 'e', price: 50 }),
        new StubEntity({ name: 'f', price: 50 }),
        new StubEntity({ name: 'g', price: 50 }),
      ]

      let paginatedItems = await sut['applyPaginate'](items, 1, 2)
      expect(paginatedItems).toStrictEqual([items[0], items[1]])
      expect(paginatedItems).toHaveLength(2)

      paginatedItems = await sut['applyPaginate'](items, 2, 2)
      expect(paginatedItems).toStrictEqual([items[2], items[3]])
      expect(paginatedItems).toHaveLength(2)

      paginatedItems = await sut['applyPaginate'](items, 4, 2)
      expect(paginatedItems).toStrictEqual([items[6]])
      expect(paginatedItems).toHaveLength(1)

      paginatedItems = await sut['applyPaginate'](items, 1, 10)
      expect(paginatedItems).toStrictEqual(items)
      expect(paginatedItems).toHaveLength(7)

      paginatedItems = await sut['applyPaginate'](items, 5, 10)
      expect(paginatedItems).toStrictEqual([])
      expect(paginatedItems).toHaveLength(0)
    })
  })

  describe('Search method', () => {
    it('Should apply only pagination  where the others params are null', async () => {
      const entity = new StubEntity({ name: 'a', price: 50 })
      const items = Array(16).fill(entity)
      sut.items = items
      const params = await sut.search(new SearchParams())
      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
        }),
      )
    })

    it('Should apply pagination  and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'TeSt', price: 50 }),
      ]

      sut.items = items

      let params = await sut.search(
        new SearchParams({
          filter: 'TEST',
          page: 1,
          perPage: 2,
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        }),
      )

      params = await sut.search(
        new SearchParams({
          filter: 'TEST',
          page: 2,
          perPage: 2,
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        }),
      )
    })

    it('Should apply paginate and sort', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'd', price: 50 }),
        new StubEntity({ name: 'e', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
      ]

      sut.items = items

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3], items[2]],
          currentPage: 1,
          perPage: 2,
          filter: null,
          sort: 'name',
          sortDir: 'desc',
          total: 5,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4], items[0]],
          currentPage: 2,
          perPage: 2,
          filter: null,
          sort: 'name',
          sortDir: 'desc',
          total: 5,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1], items[0]],
          currentPage: 1,
          perPage: 2,
          filter: null,
          sort: 'name',
          sortDir: 'asc',
          total: 5,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          currentPage: 3,
          perPage: 2,
          filter: null,
          sort: 'name',
          sortDir: 'asc',
          total: 5,
        }),
      )
    })
  })
})
