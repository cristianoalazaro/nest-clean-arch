import { RepositoryInterface } from '@/shared/domain/repositories/repository-contract'
import { UserEntity } from '../domain/entities/user.entity'

export interface UserRepositoryInterface extends RepositoryInterface<UserEntity> {
  findByEmail(email: string): Promise<UserEntity>
  emailExists(email: string): Promise<void>
}
