import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UserInMemoryRepository } from './database/repository/user-in-memory.repository'
import { BcryptHashProvider } from './providers/hashProvider/bcryptjs-hash.provider'
import { SignupUseCase } from '../application/usecases/signup.usecase'
import { UserRepositoryInterface } from '../repositories/user.repository.interface'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { SigninUseCase } from '../application/usecases/signin.usecase'
import { GetUserUseCase } from '../application/usecases/getUser.usecase'
import { ListUserUseCase } from '../application/usecases/listUser.usecase'
import { UpdateUserUseCase } from '../application/usecases/updateUser.usecase'
import { UpdatePasswordUserUseCase } from '../application/usecases/updatePasswordUser.usecase'
import { DeleteUserUseCase } from '../application/usecases/deleteUser.usecase'

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptHashProvider,
    },
    {
      provide: SignupUseCase.UseCase,
      useFactory: (
        userRepository: UserRepositoryInterface.Repository,
        hashProvider: HashProvider,
      ) => {
        return new SignupUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SigninUseCase.UseCase,
      useFactory: (
        userRepository: UserRepositoryInterface.Repository,
        hashProvider: HashProvider,
      ) => {
        return new SigninUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepository: UserRepositoryInterface.Repository) => {
        return new GetUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUserUseCase.UseCase,
      useFactory: (userRepository: UserRepositoryInterface.Repository) => {
        return new ListUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase,
      useFactory: (userRepository: UserRepositoryInterface.Repository) => {
        return new UpdateUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUserUseCase.UseCase,
      useFactory: (
        userRepository: UserRepositoryInterface.Repository,
        hashProvider: HashProvider,
      ) => {
        return new UpdatePasswordUserUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase,
      useFactory: (userRepository: UserRepositoryInterface.Repository) => {
        return new DeleteUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
