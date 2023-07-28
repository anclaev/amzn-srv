import { Module } from '@nestjs/common'

import { SentryModule as RootSentryModule } from '@ntegral/nestjs-sentry'

import { ConfigModule } from '@/config/config.module'
import { ConfigService } from '@/config/config.service'

import { ENV, ENVIRONMENT } from '@common/enums'

@Module({
  imports: [
    RootSentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const environment = config.get<string>(ENV.ENVIRONMENT)

        return {
          dsn: config.get<string>(ENV.SENTRY_DSN),
          environment,
          enabled:
            environment === ENVIRONMENT.STAGING ||
            environment === ENVIRONMENT.PRODUCTION,
        }
      },
    }),
  ],
})
export class SentryModule {}
