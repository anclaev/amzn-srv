import {
  ConfigModule as AppConfigModule,
  ConfigService as AppConfigService,
} from '@nestjs/config'

import { Module } from '@nestjs/common'
import * as Joi from '@hapi/joi'

import { ConfigService } from './config.service'

@Module({
  imports: [
    AppConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().default(4200),
        APP_NAME: Joi.string().default('Nest'),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class ConfigModule {}
