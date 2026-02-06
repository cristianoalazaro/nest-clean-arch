import { Controller, Get, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ConflictErrorFilter } from '../../conflict-error.filter'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import request from 'supertest'

@Controller('/stub')
class StubController {
  @Get()
  indexedDB() {
    throw new ConflictError('Conflicting data')
  }
}

describe('ConflictError (e2e)', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({ controllers: [StubController] }).compile()

    app = module.createNestApplication()
    app.useGlobalFilters(new ConflictErrorFilter())
    app.init()
  })

  it('Should be defined', () => {
    expect(app).toBeDefined()
  })

  it('Should get a ConflicError', () => {
    return request(app.getHttpServer()).get('/stub').expect(409).expect({
      statusCode: 409,
      error: 'Conflict',
      message: 'Conflicting data',
    })
  })
})
