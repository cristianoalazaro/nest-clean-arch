import { UpdateUserUseCase } from 'src/users/application/usecases/update-user.usercase'

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  name: string
}
