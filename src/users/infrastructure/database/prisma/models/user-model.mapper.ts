import { User } from 'src/shared/infrastructure/database/generated/prisma/client'
import { ValidationError } from 'src/shared/infrastructure/domain/errors/validation-error'
import { UserEntity } from 'src/users/domain/entities/user.entity'

export class UserModelMapper {
  static toEntity(model: User): UserEntity {
    const data = {
      name: model.name,
      email: model.email,
      password: model.password,
      createdAt: model.createdAt,
    }

    try {
      return new UserEntity(data, model.id)
    } catch {
      throw new ValidationError('An entity not be loaded')
    }
  }
}
