import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvConfig } from './env-config.interface'

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private configService: ConfigService) {}
  getAppPort(): number {
    const port = this.configService.get<string>('PORT')
    return port ? Number(port) : 3000 // Retorna 3000 se não existir
  }
  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') ?? ''
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') ?? ''
  }

  getJwtExpiresInSeconds(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN_SECONDS')
    return expiresIn ? Number(expiresIn) : 86400 // Retorna 86400 segundos (1 dia) se não existir
  }
}
