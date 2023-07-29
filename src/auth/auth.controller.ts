import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'

import { Response } from 'express'

import { AuthService } from './auth.service'

import { AuthRegisterDto } from './dto/auth-register.dto'

import { Validation } from '@decorators/validation'
import { Request, ReqUser } from '@common/types'

import { LocalAuthGuard } from '@/auth/guards/local-auth.guard'
import { Auth } from '@decorators/auth'
import { JwtRefreshGuard } from '@/auth/guards/jwt-refresh.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Validation()
  @HttpCode(201)
  @Post('register')
  async register(
    @Body() dto: AuthRegisterDto,
    @Res() res: Response,
    @Req() { fingerprint }: Request,
  ) {
    const { user, refreshToken, accessToken } = await this.authService.register(
      dto,
      fingerprint,
    )

    const { access, refresh } = this.authService.getCookiesWithTokens(
      accessToken,
      refreshToken,
    )

    res.setHeader('Set-Cookie', [access, refresh])

    return res.send(user)
  }

  @Validation()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() { user }: ReqUser,
    @Res() res: Response,
    @Req() { fingerprint }: Request,
  ) {
    const { refreshToken, accessToken, ...credentials } =
      await this.authService.login(user, fingerprint)

    const { access, refresh } = this.authService.getCookiesWithTokens(
      accessToken,
      refreshToken,
    )

    res.setHeader('Set-Cookie', [access, refresh])

    res.send(credentials.user)
  }

  @Auth()
  @Post('logout')
  async logout(@Req() req: ReqUser, @Res() res: Response) {
    const cookies = this.authService.getCookiesForLogout()
    await this.authService.logout(req.cookies.Refresh)

    res.setHeader('Set-Cookie', cookies)

    return res.sendStatus(200)
  }

  /**
   * Получение нового токена авторизации от токена обновления
   * @param {ReqUser} req Объект запроса с пользователем
   */
  @Validation()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: ReqUser) {
    const cookie = await this.authService.refreshTokens(req.user)

    req.res.setHeader('Set-Cookie', cookie)
    return req.user
  }
}
