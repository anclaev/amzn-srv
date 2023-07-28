import {
  ConfigModule as AppConfigModule,
  ConfigService as AppConfigService,
} from '@nestjs/config'

import { Module } from '@nestjs/common'

import { validationSchema } from '@utils/config-validation-schema'

import { ConfigService } from './config.service'
@Module({
  imports: [
    AppConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class ConfigModule {}
