import { Entity } from '../../../entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'

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

  describe('Sort method', () => {})
})
