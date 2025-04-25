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

  describe('ApplySort method', () => {})
  describe('ApplyPaginate method', () => {})
  describe('Sort method', () => {})
})
