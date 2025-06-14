import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../../users.controller'
import { UserOutput } from 'src/users/application/dtos/user-output'
import { SignUpUseCase } from 'src/users/application/usecases/signup.usecase'
import { SigninDto } from '../../dtos/signin.dto'

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
    const output: UserOutput = props
    const mockSigninUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['signinUseCase'] = mockSigninUseCase as any

    const result = await sut.login(input)

    expect(result).toMatchObject(output)
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input)
  })
})
