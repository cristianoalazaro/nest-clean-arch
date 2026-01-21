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
}
