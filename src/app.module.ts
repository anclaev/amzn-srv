import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { ConfigModule } from './config/config.module'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'

@Module({
  imports: [ConfigModule, CommonModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
