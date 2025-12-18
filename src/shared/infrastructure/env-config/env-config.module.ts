import { DynamicModule, Module } from '@nestjs/common'
import { EnvConfigService } from './env-config.service'
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config'
import { join } from 'node:path'

@Module({
  imports: [ConfigModule],
  providers: [EnvConfigService],
  exports: [EnvConfigModule],
})
export class EnvConfigModule extends ConfigModule {
  static forRoot<ValidationOptions extends Record<string, any>>(
    options?: ConfigModuleOptions<ValidationOptions>,
  ): Promise<DynamicModule> {
    return super.forRoot(
      (options = {
        ...options,
        envFilePath: join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
      }),
    )
  }
}
