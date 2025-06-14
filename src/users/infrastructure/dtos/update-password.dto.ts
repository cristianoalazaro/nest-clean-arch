import { SignInUseCase } from 'src/users/application/usecases/signin-usecase'
import { UpdatePasswordUseCase } from 'src/users/application/usecases/update-password.usecase'

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  password: string
  oldPassword: string
}
