import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { AuthService } from './auth.service'

import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

import { Validation } from '@decorators/validation'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Validation()
  @HttpCode(201)
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto)
  }

  @Validation()
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto)
  }

  @Validation()
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto)
  }
}
