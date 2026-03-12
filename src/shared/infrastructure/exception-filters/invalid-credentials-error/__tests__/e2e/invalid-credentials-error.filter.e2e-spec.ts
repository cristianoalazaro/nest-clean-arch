import { Controller, Get, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { InvalidCredentialError } from '@/shared/application/errors/invalid-credential-error'
import { InvalidCredentialsErrorFilter } from '../../invalid-credentials-error.filter'

@Controller('/stub')
class StubController {
  @Get()
  index() {
    throw new InvalidCredentialError('Invalid Credentials')
  }
}

describe('InvalidCredentialErrorFilter e2e tests', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile()

    app = module.createNestApplication()
    app.useGlobalFilters(new InvalidCredentialsErrorFilter())
    app.init()
  })

  it('Should be defined', () => {
    expect(new InvalidCredentialsErrorFilter()).toBeDefined()
  })

  it('Should get a InvalidCredentialsError', async () => {
    return request(app.getHttpServer()).get('/stub').expect(400).expect({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid Credentials',
    })
  })
})
