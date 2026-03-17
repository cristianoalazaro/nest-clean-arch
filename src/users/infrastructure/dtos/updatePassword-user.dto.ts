import { UpdatePasswordUserUseCase } from '@/users/application/usecases/updatePasswordUser.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePasswordUserDto implements Omit<UpdatePasswordUserUseCase.Input, 'id'> {
  @ApiProperty({
    description: 'Nova senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: 'Senha atual do usuário',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string
}
