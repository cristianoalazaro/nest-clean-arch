import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'

export class UserPrismaRepository implements UserRepositoryInterface.Repository {
  sortableFields: string[]

  constructor(private prismaService: PrismaService) {}

  findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.')
  }

  search(
    props: UserRepositoryInterface.SearchParams,
  ): Promise<UserRepositoryInterface.SearchResults> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }

  insert(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }

  update(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  emailExists(email: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
