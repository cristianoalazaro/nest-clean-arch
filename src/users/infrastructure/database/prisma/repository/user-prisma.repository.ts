import { PrismaService } from 'src/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from 'src/users/domain/entities/user.entity'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { UserModelMapper } from '../models/user-model.mapper'
import { NotFoundError } from 'src/shared/infrastructure/domain/errors/not-found-error'
import { ConflictError } from 'src/shared/infrastructure/domain/errors/conflict-error'

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt']

  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new NotFoundError(`User not found using email ${email}`)
    }
    return UserModelMapper.toEntity(user)
  }

  async emailExists(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    })

    if (user) {
      throw new ConflictError('Email address already used')
    }
  }

  async search(
    props: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    const sortable = this.sortableFields.includes(props.sort ?? '') ?? false
    const orderByField = sortable && props.sort ? props.sort : 'createdAt'
    const orderByDir = sortable ? props.sortDir : 'desc'

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
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    })

    return new UserRepository.SearchResult({
      items: models.map(model => UserModelMapper.toEntity(model)),
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      total: count,
      filter: props.filter,
    })
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

  async update(entity: UserEntity): Promise<void> {
    await this._get(entity._id)
    await this.prismaService.user.update({
      data: entity.toJson(),
      where: {
        id: entity._id,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.prismaService.user.delete({
      where: { id },
    })
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
