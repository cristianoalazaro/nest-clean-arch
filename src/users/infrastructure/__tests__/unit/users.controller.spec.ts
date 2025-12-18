import { UserOutput } from '@/users/application/dtos/user-output'
import { UsersController } from '../../users.controller'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { SigninUseCase } from '@/users/application/usecases/signin.usecase'
import { SignInDto } from '../../dtos/signIn.dto'
import { SignUpDto } from '../../dtos/signUp.dto'

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
})
