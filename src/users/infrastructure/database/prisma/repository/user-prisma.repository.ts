import { PrismaService } from 'src/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { UserModelMapper } from '../models/user-model.mapper'
import { NotFoundError } from 'src/shared/infrastructure/domain/errors/not-found-error'

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[]

  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }

  emailExists(email: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  search(
    props: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity.toJson(),
    })
  }

  findById(id: string): Promise<UserEntity> {
    return this._get(id)
  }

  async findAll(): Promise<UserEntity[]> {
    const models = await this.prismaService.user.findMany()
    return models.map(model => UserModelMapper.toEntity(model))
  }

  update(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async _get(id: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundError(`User not found using ID ${id}`)
    }

    return UserModelMapper.toEntity(user)
  }
}
