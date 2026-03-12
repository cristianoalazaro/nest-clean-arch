import { Controller, Get, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { InvalidPasswordErrorFilter } from '../../invalid-password-error.filter'

@Controller('/stub')
class StubController {
  @Get()
  index() {
    throw new InvalidPasswordError('Invalid Password')
  }
}

describe('InvalidPasswordErrorFilter e2e tests', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile()

    app = module.createNestApplication()
    app.useGlobalFilters(new InvalidPasswordErrorFilter())
    app.init()
  })

  it('Should be defined', () => {
    expect(new InvalidPasswordErrorFilter()).toBeDefined()
  })

  it('Should get a InvalidPasswordError', async () => {
    return request(app.getHttpServer()).get('/stub').expect(422).expect({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: 'Invalid Password',
    })
  })
})
