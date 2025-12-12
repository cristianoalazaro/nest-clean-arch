import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InMemorySearchRepository } from '@/shared/domain/repositories/in-memory-search.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'

export class UserInMemoryRepository
  extends InMemorySearchRepository<UserEntity>
  implements UserRepositoryInterface
{
  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find(item => item.email === email)

    if (!entity)
      throw new NotFoundError(`Entity not found using e-mail: ${email}!`)

    return entity
  }
  async emailExists(email: string): Promise<void> {
    const entity = this.items.find(item => item.email === email)

    if (entity) throw new ConflictError('E-mail address already used!')
  }
}
