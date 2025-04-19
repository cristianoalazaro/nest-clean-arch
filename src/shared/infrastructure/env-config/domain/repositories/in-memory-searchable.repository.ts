import { Entity } from '../entities/entity'
import { InMemoryRepository } from './in-memory.repository'
import { SearchableRepository } from './searchable-repository-contract'

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepository<E, any, any>
{
  search(props: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
