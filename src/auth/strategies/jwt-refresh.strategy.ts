import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

import { ConfigService } from '@/config/config.service'
import { UserCredentials } from '@common/types'
import { ENV } from '@common/enums'
import { AuthService } from '@/auth/auth.service'

/**
 * Стратегия валидации токена обновления
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly auth: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh
        },
      ]),
      secretOrKey: config.get<string>(ENV.JWT_REFRESH_SECRET),
      passReqToCallback: true,
    })
  }

  /**
   * Метод валидации токена обновления
   * @param {ReqUser} req Запрос
   * @returns {UserCredentials} Авторизационные данные пользователя
   */
  async validate(
    req: Request,
    { id }: UserCredentials,
  ): Promise<UserCredentials> {
    const refreshToken = req.cookies?.Refresh

    await this.jwt
      .verifyAsync<{ id: number }>(refreshToken, {
        secret: this.config.get<string>(ENV.JWT_REFRESH_SECRET),
      })
      .catch(() => {
        throw new UnauthorizedException('Invalid refresh token')
      })

    const { user } = await this.auth.login({ id, email: '' })

    return user
  }
}
