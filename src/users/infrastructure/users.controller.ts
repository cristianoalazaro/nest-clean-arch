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
import { UserOutput } from '../application/dtos/user-output'
import { UserPresenter } from './presenters/user.presenter'

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

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output)
  }

  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    const output = await this.signUpUseCase.execute(signUpDto)
    return UsersController.userToResponse(output)
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    const output = await this.signInUseCase.execute(signInDto)
    return UsersController.userToResponse(output)
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return await this.listUserUseCase.execute(searchParams)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id })
    return UsersController.userToResponse(output)
  }

  @Put(':id')
  async updateName(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({ id, ...updateUserDto })
    return UsersController.userToResponse(output)
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ) {
    const output = await this.updatePasswordUserUseCase.execute({
      id,
      ...updatePasswordUserDto,
    })

    return UsersController.userToResponse(output)
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id })
  }
}
