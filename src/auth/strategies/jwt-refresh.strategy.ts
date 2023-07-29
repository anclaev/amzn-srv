import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtService } from '@nestjs/jwt'

import { ConfigService } from '@/config/config.service'
import { SessionService } from '@/auth/session.service'
import { AuthService } from '@/auth/auth.service'

import { Request, UserCredentials } from '@common/types'
import { ENV } from '@common/enums'

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
    private readonly session: SessionService,
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
   * @param {UserCredentials} credentials ID пользователя
   * @returns {UserCredentials} Авторизационные данные пользователя
   */
  async validate(
    req: Request,
    { id }: UserCredentials,
  ): Promise<UserCredentials> {
    const refreshToken = req.cookies?.Refresh
    const fingerprint = req.fingerprint

    const session = await this.session.getSessionByFingerprint(fingerprint)

    if (!session || session.token !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const { user } = await this.auth.login(
      { id, email: '', role: 'CONSUMER' },
      req.fingerprint,
    )

    return user
  }
}
