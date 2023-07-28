import { JwtModuleOptions } from '@nestjs/jwt'

import { ConfigService } from '@/config/config.service'

import { ENV } from '@/common/enums'

export const jwtConfig = async (
  config: ConfigService,
): Promise<JwtModuleOptions> => ({
  secret: config.get<string>(ENV.JWT_ACCESS_SECRET),
  signOptions: {
    expiresIn: config.get<number>(ENV.JWT_ACCESS_EXPIRATION) + 's',
  },
})
