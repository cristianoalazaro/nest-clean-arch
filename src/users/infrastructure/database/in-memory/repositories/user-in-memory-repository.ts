import { ConflictError } from 'src/shared/infrastructure/env-config/domain/errrors/conflict-error'
import { NotFoundError } from 'src/shared/infrastructure/env-config/domain/errrors/not-found-error'
import { InMemorySearchableRepository } from 'src/shared/infrastructure/env-config/domain/repositories/in-memory-searchable.repository'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserRepository } from 'src/users/domain/repositories/user.repository'

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find(item => item.email === email)
    if (!entity) {
      throw new NotFoundError(`Entity not found using email ${email}`)
    }
    return entity
  }

  async emailExists(email: string): Promise<void> {
    const entity = this.items.find(item => item.email === email)
    if (entity) {
      throw new ConflictError('Email address already used')
    }
  }
}
