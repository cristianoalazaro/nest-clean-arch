import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'
import { SearchParams } from '../../searchable-repository-contract'

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
    return items.filter(
      item => item.props.name.toLowerCase() === filter.toLowerCase(),
    )
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository
  let items: StubEntity[]

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository()
  })

  describe('applyFilter', () => {
    it('Should no filtered items when params is null', async () => {
      items = [new StubEntity({ name: 'value name', price: 50 })]
      const spyFilterMethod = jest.spyOn(items, 'filter')
      const filteredItems = await sut['applyFilter'](items, null)

      expect(filteredItems).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('Should filter using filter value', async () => {
      items = [
        new StubEntity({ name: 'test', price: 50 }),
        new StubEntity({ name: 'Test', price: 50 }),
        new StubEntity({ name: 'fake', price: 50 }),
      ]
      const spyFilterMethod = jest.spyOn(items, 'filter')

      let filteredItems = await sut['applyFilter'](items, 'TEST')
      expect(filteredItems).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      filteredItems = await sut['applyFilter'](items, 'test')
      expect(filteredItems).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)

      filteredItems = await sut['applyFilter'](items, 'no-filter')
      expect(filteredItems).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
    })
  })

  describe('applySort', () => {
    it('Should no sort items', async () => {
      items = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
      ]

      const spySortMethod = jest.spyOn(items, 'sort')

      let sortedItems = await sut['applySort'](items, null, null)
      expect(sortedItems).toStrictEqual(items)
      expect(spySortMethod).not.toHaveBeenCalled()

      sortedItems = await sut['applySort'](items, 'price', 'asc')
      expect(sortedItems).toStrictEqual(items)
      expect(spySortMethod).not.toHaveBeenCalled()
    })

    it('Should sort items', async () => {
      items = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
      ]

      let sortedItems = await sut['applySort'](items, 'name', 'asc')
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]])

      sortedItems = await sut['applySort'](items, 'name', 'desc')
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]])
    })
  })

  describe('applyPagination', () => {
    it('Should paginate items', async () => {
      items = [
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
        new StubEntity({ name: 'd', price: 50 }),
        new StubEntity({ name: 'e', price: 50 }),
      ]

      let paginatedItems = await sut['applyPaginate'](items, 1, 2)
      expect(paginatedItems).toHaveLength(2)
      expect(paginatedItems).toEqual([items[0], items[1]])

      paginatedItems = await sut['applyPaginate'](items, 2, 2)
      expect(paginatedItems).toHaveLength(2)
      expect(paginatedItems).toEqual([items[2], items[3]])

      paginatedItems = await sut['applyPaginate'](items, 3, 2)
      expect(paginatedItems).toHaveLength(1)
      expect(paginatedItems).toEqual([items[4]])

      paginatedItems = await sut['applyPaginate'](items, 4, 2)
      expect(paginatedItems).toHaveLength(0)
      expect(paginatedItems).toEqual([])
    })
  })

  describe('search', () => {})
})
