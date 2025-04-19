import { SearchableRepository } from 'src/shared/infrastructure/env-config/domain/repositories/searchable-repository-contract'
import { UserEntity } from '../entities/user.entity'

export interface UserRepository
  extends SearchableRepository<UserEntity, any, any> {
  findByEmail(email: string): Promise<UserEntity>
  emailExists(email: string): Promise<void>
}
