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

import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger'
import { Response } from 'express'

import { AuthService } from './auth.service'
import { AuthDto } from './auth.dto'

import { Validation } from '@decorators/validation'
import { Auth } from '@decorators/auth'

import { Request, ReqUser } from '@common/types'

import { JwtRefreshGuard } from '@/auth/guards/jwt-refresh.guard'
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard'

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Регистрация пользователя',
  })
  @ApiBody({
    type: AuthDto,
    description: 'Данные для авторизации',
  })
  @Validation()
  @HttpCode(201)
  @Post('register')
  async register(
    @Body() dto: AuthDto,
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

  @ApiOperation({
    summary: 'Авторизация пользователя',
  })
  @ApiBody({
    type: AuthDto,
    description: 'Данные для авторизации',
  })
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

  @ApiOperation({
    summary: 'Выход из системы',
  })
  @Auth()
  @Post('logout')
  async logout(@Req() req: ReqUser, @Res() res: Response) {
    const cookies = this.authService.getCookiesForLogout()
    await this.authService.logout(req.cookies.Refresh)

    res.setHeader('Set-Cookie', cookies)

    return res.sendStatus(200)
  }

  @ApiOperation({
    summary: 'Обновление токена пользователя',
  })
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
