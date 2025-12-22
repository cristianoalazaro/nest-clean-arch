import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { UserModelMapper } from '../mappers/user-model.mapper'

export class UserPrismaRepository implements UserRepositoryInterface.Repository {
  sortableFields: string[]

  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany()
    return users.map(user => UserModelMapper.toEntity(user))
  }

  search(
    props: UserRepositoryInterface.SearchParams,
  ): Promise<UserRepositoryInterface.SearchResults> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<UserEntity> {
    return this._get(id)
  }

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity,
    })
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

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } })
      return UserModelMapper.toEntity(user!)
    } catch {
      throw new NotFoundError(`User not found with ID ${id}`)
    }
  }
}
