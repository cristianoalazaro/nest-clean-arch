import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { Controller, Get, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundErrorFilter } from '../../not-found-error.filter'
import request from 'supertest'

@Controller('/stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundError('Not found data')
  }
}

describe('NotFoundErrorFilter e2e tests', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile()

    app = module.createNestApplication()
    app.useGlobalFilters(new NotFoundErrorFilter())
    app.init()
  })

  it('Should be defined', () => {
    expect(new NotFoundErrorFilter()).toBeDefined()
  })

  it('Should get a NotFoundError', async () => {
    return request(app.getHttpServer()).get('/stub').expect(404).expect({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not found data',
    })
  })
})
