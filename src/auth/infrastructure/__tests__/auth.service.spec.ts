import { Test } from '@nestjs/testing'
import { AuthService } from '../auth.service'
import { JwtService } from '@nestjs/jwt'
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service'
import { ConfigService } from '@nestjs/config'

describe('AuthService unit tests', () => {
  let sut: AuthService
  let configService: ConfigService
  let envConfigService: EnvConfigService
  let jwtService: JwtService

  beforeEach(async () => {
    configService = new ConfigService()
    envConfigService = new EnvConfigService(configService)
    jwtService = new JwtService({
      global: true,
      secret: 'fakeSecret',
      signOptions: { expiresIn: 86400, subject: 'fakeId' },
    })

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: EnvConfigService,
          useValue: envConfigService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile()

    sut = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should return a JWT token', async () => {
    const result = await sut.generateJwt('fakeUserId')

    expect(Object.keys(result)).toEqual(['accessToken'])
    expect(typeof result.accessToken).toEqual('string')
  })

  it('should verify a JWT token', async () => {
    const validToken = await sut.generateJwt('fakeUserId')

    expect(validToken).not.toBeNull()
    await expect(sut.verifyJwt('invalidToken')).rejects.toThrow()
    await expect(
      sut.verifyJwt(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
      ),
    ).rejects.toThrow()
  })
})
