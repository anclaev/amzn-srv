import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { AuthService } from './auth.service'

import { AuthRegisterDto } from './dto/auth-register.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { AuthLoginDto } from '@/auth/dto/auth-login.dto'

import { Validation } from '@decorators/validation'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Validation()
  @HttpCode(201)
  @Post('register')
  async register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto)
  }

  @Validation()
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto)
  }

  @Validation()
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto)
  }
}
