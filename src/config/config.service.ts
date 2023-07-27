import { ConfigService as AppConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

import { ENV } from '@common/enums'

@Injectable()
export class ConfigService {
  constructor(private readonly config: AppConfigService) {}

  get dbUrl(): string {
    return this.config.get<string>(ENV.DATABASE_URL)
  }

  get port(): number {
    return this.config.get<number>(ENV.PORT)
  }

  get app_name(): string {
    return this.config.get<string>(ENV.APP_NAME)
  }

  get<T>(name: string): T {
    return this.config.get<T>(name)
  }
}
