import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common'
import { UpdateUserDto } from './dtos/update-user.dto'
import { SignUpDto } from './dtos/signUp.dto'
import { UpdatePasswordUserDto } from './dtos/updatePassword-user.dto'
import { SignupUseCase } from '../application/usecases/signup.usecase'
import { SigninUseCase } from '../application/usecases/signin.usecase'
import { UpdateUserUseCase } from '../application/usecases/updateUser.usecase'
import { UpdatePasswordUserUseCase } from '../application/usecases/updatePasswordUser.usecase'
import { DeleteUserUseCase } from '../application/usecases/deleteUser.usecase'
import { ListUserUseCase } from '../application/usecases/listUser.usecase'
import { ListUsersDto } from './dtos/list-users.dto'
import { GetUserUseCase } from '../application/usecases/getUser.usecase'
import { SignInDto } from './dtos/signIn.dto'

@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase) signUpUseCase: SignupUseCase.UseCase
  @Inject(SigninUseCase.UseCase) signInUseCase: SigninUseCase.UseCase
  @Inject(UpdateUserUseCase.UseCase) updateUserUseCase: UpdateUserUseCase.UseCase
  @Inject(UpdatePasswordUserUseCase.UseCase)
  updatePasswordUserUseCase: UpdatePasswordUserUseCase.UseCase
  @Inject(DeleteUserUseCase.UseCase) deleteUserUseCase: DeleteUserUseCase.UseCase
  @Inject(ListUserUseCase.UseCase) listUserUseCase: ListUserUseCase.UseCase
  @Inject(GetUserUseCase.UseCase) getUserUseCase: GetUserUseCase.UseCase

  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    return await this.signUpUseCase.execute(signUpDto)
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    return await this.signInUseCase.execute(signInDto)
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return await this.listUserUseCase.execute(searchParams)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getUserUseCase.execute({ id })
  }

  @Put(':id')
  async updateName(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.updateUserUseCase.execute({ id, ...updateUserDto })
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ) {
    return await this.updatePasswordUserUseCase.execute({
      id,
      ...updatePasswordUserDto,
    })
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id })
  }
}
