import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../../users.controller'
import { UserOutput } from 'src/users/application/dtos/user-output'
import { SignUpUseCase } from 'src/users/application/usecases/signup.usecase'
import { SigninDto } from '../../dtos/signin.dto'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { SignInUseCase } from 'src/users/application/usecases/signin-usecase'
import { UpdateUserUseCase } from 'src/users/application/usecases/update-user.usercase'
import { UpdatePasswordDto } from '../../dtos/update-password.dto'
import { DeleteUserUseCase } from 'src/users/application/usecases/delete-user.usecase'
import { GetUserUseCase } from 'src/users/application/usecases/getuser.usecase'
import { ListUsersDto } from '../../dtos/list-users.dto'
import { ListUsersUseCase } from 'src/users/application/usecases/listusers.usecase'
import { PaginationOutputMapper } from 'src/shared/application/dtos/pagination-output'

describe('UsersController unit tests', () => {
  let sut: UsersController
  let id: string
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = '2e511afa-c4ca-4754-8b40-f229fda00922'
    props = {
      id,
      name: 'Test Name',
      email: 'test@name.com',
      password: '123456',
      createdAt: new Date(),
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('Should create a user', async () => {
    const input: SignUpUseCase.Input = {
      name: 'Test Name',
      email: 'test@name.com',
      password: '123456',
    }

    const output: SignUpUseCase.Output = props

    const mockSignupUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['signupUseCase'] = mockSignupUseCase as any

    const result = await sut.create(input)

    expect(result).toMatchObject(output)
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('Should authenticate a user', async () => {
    const input: SigninDto = { email: 'test@name.com', password: '123456' }
    const output: SignInUseCase.Output = props
    const mockSigninUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['signinUseCase'] = mockSigninUseCase as any

    const result = await sut.login(input)

    expect(result).toMatchObject(output)
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('Should update a user', async () => {
    const input: UpdateUserDto = { name: 'Test Name Altered' }
    const output: UpdateUserUseCase.Output = props
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any

    const result = await sut.update(id, input)

    expect(result).toMatchObject(output)
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input })
  })

  it('Should update a password', async () => {
    const input: UpdatePasswordDto = {
      password: '000123',
      oldPassword: '123456',
    }
    const output: UpdateUserUseCase.Output = props
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any

    const result = await sut.updatePassword(id, input)

    expect(result).toMatchObject(output)
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    })
  })

  it('Should delete a user', async () => {
    const output = undefined
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any

    const result = await sut.remove(id)

    expect(result).toStrictEqual(output)
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id })
  })

  it('Should get a user', async () => {
    const output: GetUserUseCase.Output = props
    const mockGetUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['getUserUseCase'] = mockGetUserUseCase as any

    const result = await sut.findOne(id)

    expect(result).toMatchObject(output)
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id })
  })

  it('Should list users', async () => {
    const searchParams: ListUsersDto = {
      page: 1,
      perPage: 15,
    }

    const output: ListUsersUseCase.Output = {
      items: [props],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    }

    const mockListUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['listUsersUseCase'] = mockListUserUseCase as any

    const result = await sut.Search(searchParams)

    expect(result).toStrictEqual(output)
    expect(mockListUserUseCase.execute).toHaveBeenCalledWith(searchParams)
  })
})
