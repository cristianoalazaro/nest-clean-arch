import { Entity } from '../../../entities/entity'
import { NotFoundError } from '../../../errrors/not-found-error'
import { InMemoryRepository } from '../../in-memory.repository'

type EntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<EntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository

  beforeEach(() => {
    sut = new StubInMemoryRepository()
  })

  it('Should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'Test name', price: 100 })
    await sut.insert(entity)
    expect(entity.toJson()).toStrictEqual(sut.items[0].toJson())
  })

  it('Should throw an error when the entity not found', async () => {
    await expect(sut.findById('id_fake')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should find an entity by id', async () => {
    const entity = new StubEntity({ name: 'Other Name', price: 10 })
    await sut.insert(entity)
    const result = await sut.findById(entity.id)
    expect(result.toJson()).toStrictEqual(entity.toJson())
  })

  it('Should return all entities', async () => {
    const entity = new StubEntity({ name: 'Other Name', price: 10 })
    await sut.insert(entity)
    const result = await sut.findAll()
    expect([entity]).toStrictEqual(sut.items)
  })

  it('Should throw an error on update when an entity not found', async () => {
    const entity = new StubEntity({ name: 'Other', price: 15.5 })
    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should update an entity', async () => {
    const entity = new StubEntity({ name: 'Other Name', price: 10 })
    await sut.insert(entity)
    const updatedEntity = new StubEntity(
      {
        ...entity.props,
        name: 'Altered Name',
      },
      entity.id,
    )
    await sut.update(updatedEntity)
    expect(sut.items[0].toJson()).toStrictEqual(updatedEntity.toJson())
  })

  it('Should throw an error on delete when an entity not found', async () => {
    const entity = new StubEntity({ name: 'Other', price: 15.5 })
    await expect(sut.delete(entity.id)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should delete an entity', async () => {
    const entity = new StubEntity({ name: 'Other Name', price: 10 })
    await sut.insert(entity)
    await sut.delete(entity.id)
    expect(sut.items).toStrictEqual([])
  })
})
