import { Entity } from '../entities/entity'
import { NotFoundError } from '../errors/not-found-error'
import { RepositoryInterface } from './repository-contracts'

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  itens: E[] = []

  async insert(entity: E): Promise<void> {
    this.itens.push(entity)
  }

  async findById(id: string): Promise<E> {
    return this._get(id)
  }

  async findAll(): Promise<E[]> {
    return this.itens
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id)
    const index = this.itens.findIndex(item => item.id === entity.id)
    this.itens[index] = entity
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    const index = this.itens.findIndex(item => item.id === id)
    this.itens.splice(index, 1)
  }

  protected async _get(id: string): Promise<E> {
    const _id = `${id}`
    const entity = this.itens.find(item => item.id === _id)

    if (!entity) {
      throw new NotFoundError('Item not found')
    }
    return entity
  }
}
