import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { EnvConfigModule } from '../env-config/env-config.module'
import { EnvConfigService } from '../env-config/env-config.service'

@Module({
  imports: [EnvConfigModule.forRoot()],
  providers: [EnvConfigService, PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
