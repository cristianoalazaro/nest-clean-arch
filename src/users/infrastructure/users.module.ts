import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UserInMemoryRepository } from './database/repository/user-in-memory.repository'
import { BcryptHashProvider } from './providers/hashProvider/bcryptjs-hash.provider'
import { SignupUseCase } from '../application/usecases/signup.usecase'
import { UserRepositoryInterface } from '../repositories/user.repository.interface'
import { HashProvider } from '@/shared/application/providers/hash.provider'

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
  ],
})
export class UsersModule {}
