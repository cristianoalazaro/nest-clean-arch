import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module'
import { UsersModule } from './users/infrastructure/users.module'
import { DatabaseModule } from './shared/infrastructure/database/database.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [EnvConfigModule, UsersModule, DatabaseModule],
})
export class AppModule {}
