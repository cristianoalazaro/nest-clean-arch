import { UserEntity } from '../entities/user.entity'
import { RepositoryInterface } from 'src/shared/infrastructure/env-config/domain/repositories/repository-contract'

export interface UserRepository extends RepositoryInterface<UserEntity> {
  findByEmail(email: string): Promise<UserEntity>
  emailExists(email: string): Promise<void>
}
