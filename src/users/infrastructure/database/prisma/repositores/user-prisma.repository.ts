import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepositoryInterface } from '@/users/repositories/user.repository.interface'
import { UserModelMapper } from '../mappers/user-model.mapper'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

export class UserPrismaRepository implements UserRepositoryInterface.Repository {
  sortableFields: string[] = ['name', 'createdAt']

  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany()
    return users.map(user => UserModelMapper.toEntity(user))
  }

  async search(
    props: UserRepositoryInterface.SearchParams,
  ): Promise<UserRepositoryInterface.SearchResults> {
    const sortable = (props.sort && this.sortableFields.includes(props.sort)) || false
    const orderField = sortable && props.sort ? props.sort : 'createdAt'
    const orderDir = (sortable && props.sortDir) || 'desc'

    const count = await this.prismaService.user.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    })

    const models = await this.prismaService.user.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderField]: orderDir,
      },
      skip: props.page ? (props.page - 1) * props.perPage : 0,
      take: props.perPage ? props.perPage : 15,
    })

    return new UserRepositoryInterface.SearchResults({
      currentPage: props.page,
      filter: props.filter,
      items: models.map(model => UserModelMapper.toEntity(model)),
      perPage: props.perPage,
      sort: orderField,
      sortDir: orderDir,
      total: count,
    })
  }

  findById(id: string): Promise<UserEntity> {
    return this._get(id)
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({ where: { email } })
      return UserModelMapper.toEntity(user!)
    } catch {
      throw new NotFoundError(`User not found with email ${email}`)
    }
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity,
    })
  }

  async update(entity: UserEntity): Promise<void> {
    await this._get(entity.id)
    await this.prismaService.user.update({
      data: entity,
      where: {
        id: entity.id,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.prismaService.user.delete({ where: { id } })
  }

  async emailExists(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { email } })

    if (user) {
      throw new ConflictError(`E-mail already already used`)
    }
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
