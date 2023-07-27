import { JwtModuleOptions } from '@nestjs/jwt'

import { ConfigService } from '@/config/config.service'

import { ENV } from '@/common/enums'

export const getJwtConfig = async (
  config: ConfigService,
): Promise<JwtModuleOptions> => ({
  secret: config.get<string>(ENV.JWT_SECRET),
})
