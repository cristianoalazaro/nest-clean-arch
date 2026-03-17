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
  UseGuards,
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
import { UserCollectionPresenter } from './presenters/user.collection.presenter'
import { AuthService } from '@/auth/infrastructure/auth.service'
import { AuthGuard } from '@/auth/infrastructure/auth.guard'
import { ApiBearerAuth, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase) private signUpUseCase: SignupUseCase.UseCase
  @Inject(SigninUseCase.UseCase) private signInUseCase: SigninUseCase.UseCase
  @Inject(UpdateUserUseCase.UseCase) private updateUserUseCase: UpdateUserUseCase.UseCase
  @Inject(UpdatePasswordUserUseCase.UseCase)
  private updatePasswordUserUseCase: UpdatePasswordUserUseCase.UseCase
  @Inject(DeleteUserUseCase.UseCase) private deleteUserUseCase: DeleteUserUseCase.UseCase
  @Inject(ListUserUseCase.UseCase) private listUserUseCase: ListUserUseCase.UseCase
  @Inject(GetUserUseCase.UseCase) private getUserUseCase: GetUserUseCase.UseCase
  @Inject(AuthService) private authService: AuthService

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output)
  }

  static listUsersToResponse(output: ListUserUseCase.Output) {
    return new UserCollectionPresenter(output)
  }

  @ApiResponse({
    status: 409,
    description: 'Conflito de e-mail',
  })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    const output = await this.signUpUseCase.execute(signUpDto)
    return UsersController.userToResponse(output)
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    const output = await this.signInUseCase.execute(signInDto)
    return this.authService.generateJwt(output.id)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
          },
        },
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(UserPresenter),
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros de consulta inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUserUseCase.execute(searchParams)
    return UsersController.listUsersToResponse(output)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id })
    return UsersController.userToResponse(output)
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateName(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({ id, ...updateUserDto })
    return UsersController.userToResponse(output)
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id })
  }
}
