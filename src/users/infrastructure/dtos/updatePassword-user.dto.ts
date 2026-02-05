import { UpdatePasswordUserUseCase } from '@/users/application/usecases/updatePasswordUser.usecase'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePasswordUserDto implements Omit<UpdatePasswordUserUseCase.Input, 'id'> {
  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  oldPassword: string
}
