import { UserOutput } from '@/users/application/dtos/user-output'
import { UsersController } from '../../users.controller'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { SigninUseCase } from '@/users/application/usecases/signin.usecase'
import { SignInDto } from '../../dtos/signIn.dto'
import { SignUpDto } from '../../dtos/signUp.dto'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { UpdateUserUseCase } from '@/users/application/usecases/updateUser.usecase'
import { UpdatePasswordUserDto } from '../../dtos/updatePassword-user.dto'
import { UpdatePasswordUserUseCase } from '@/users/application/usecases/updatePasswordUser.usecase'
import { GetUserUseCase } from '@/users/application/usecases/getUser.usecase'
import { ListUserUseCase } from '@/users/application/usecases/listUser.usecase'
import { ListUsersDto } from '../../dtos/list-users.dto'

describe('UsersController unit tests', () => {
  let sut: UsersController
  let id: string = '46b78811-2099-4b6a-bf24-6ecb9239003d'
  let props: UserOutput = {
    id,
    name: 'John Doe',
    email: 'a@a.com',
    password: '123456',
    createdAt: new Date(),
  }

  beforeEach(async () => {
    sut = new UsersController()
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create a user', async () => {
    const input: SignUpDto = {
      name: 'John Doe',
      email: 'a@a.com',
      password: '123456',
    }
    const output: SignupUseCase.Output = props
    const signupUseCaseMock = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['signUpUseCase'] = signupUseCaseMock as any

    const result = await sut.create(input)
    expect(result).toMatchObject(output)
    expect(signupUseCaseMock.execute).toHaveBeenCalledWith(input)
  })

  it('should authenticate a user', async () => {
    const input: SignInDto = {
      email: 'a@a.com',
      password: '123456',
    }
    const output: SigninUseCase.Output = props
    const signinUseCaseMock = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['signInUseCase'] = signinUseCaseMock as any

    const result = await sut.login(input)
    expect(result).toMatchObject(output)
    expect(signinUseCaseMock.execute).toHaveBeenCalledWith(input)
  })

  it('should update a user name', async () => {
    const input: UpdateUserDto = {
      name: 'John Doe Altered',
    }
    const output: UpdateUserUseCase.Output = props
    const updateUserUseCaseMock = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['updateUserUseCase'] = updateUserUseCaseMock as any

    const result = await sut.updateName(id, input)
    expect(result).toMatchObject(output)
    expect(updateUserUseCaseMock.execute).toHaveBeenCalledWith({ id, ...input })
  })

  it('should update a user password', async () => {
    const input: UpdatePasswordUserDto = {
      password: '123456',
      oldPassword: '456789',
    }
    const output: UpdatePasswordUserUseCase.Output = props
    const updatePasswordUserUseCaseMock = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['updatePasswordUserUseCase'] = updatePasswordUserUseCaseMock as any

    const result = await sut.updatePassword(id, input)
    expect(result).toMatchObject(output)
    expect(updatePasswordUserUseCaseMock.execute).toHaveBeenCalledWith({ id, ...input })
  })

  it('should delete a user', async () => {
    const output = undefined
    const deleteUserUseCaseMock = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['deleteUserUseCase'] = deleteUserUseCaseMock as any

    const result = await sut.remove(id)
    expect(result).toStrictEqual(output)
    expect(deleteUserUseCaseMock.execute).toHaveBeenCalledWith({ id })
  })

  it('should find a user', async () => {
    const output: GetUserUseCase.Output = props
    const getUserUseCaseMock = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['getUserUseCase'] = getUserUseCaseMock as any

    const result = await sut.findOne(id)
    expect(result).toMatchObject(output)
    expect(getUserUseCaseMock.execute).toHaveBeenCalledWith({ id })
  })

  it('should list users', async () => {
    const input: ListUsersDto = {
      filter: '',
      page: 1,
      perPage: 15,
      sort: null,
      sortDir: null,
    }

    const output: ListUserUseCase.Output = {
      items: [props],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    }
    const listUserUseCaseMock = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['listUserUseCase'] = listUserUseCaseMock as any

    const result = await sut.search(input)
    expect(result).toMatchObject(output)
    expect(listUserUseCaseMock.execute).toHaveBeenCalledWith(input)
  })
})
