import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [EnvConfigModule],
})
export class AppModule {}
