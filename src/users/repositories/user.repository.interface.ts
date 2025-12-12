import { UserEntity } from '../domain/entities/user.entity'
import { SearchableRepositoryInterface } from '@/shared/domain/repositories/searchable-repository-contract'

export interface UserRepositoryInterface extends SearchableRepositoryInterface<
  UserEntity,
  any,
  any
> {
  findByEmail(email: string): Promise<UserEntity>
  emailExists(email: string): Promise<void>
}
