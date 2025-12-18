import { UpdatePasswordUserUseCase } from '@/users/application/usecases/updatePasswordUser.usecase'

export class UpdatePasswordUserDto implements Omit<UpdatePasswordUserUseCase.Input, 'id'> {
  password: string
  oldPassword: string
}
