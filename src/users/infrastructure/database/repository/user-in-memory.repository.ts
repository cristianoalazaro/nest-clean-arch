import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepositoryInterface.Repository
{
  protected applyFilter(
    items: UserEntity[],
    filter: string | null,
  ): Promise<UserEntity[]> {
    throw new Error('Method not implemented.')
  }

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
