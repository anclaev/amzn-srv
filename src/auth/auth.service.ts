import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'
import { faker } from '@faker-js/faker'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import moment from 'moment'

import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'
import { ConfigService } from '@/config/config.service'

import { AuthRegisterDto } from './dto/auth-register.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { AuthLoginDto } from '@/auth/dto/auth-login.dto'

import {
  Cookie,
  CookieWithExpiration,
  Tokens,
  UserCredentials,
  UserWithTokens,
} from '@common/types'

import { ENV, ENVIRONMENT } from '@common/enums'

import { cookieToString } from '@utils/cookie-to-string'

@Injectable()
export class AuthService {
  private readonly env

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    this.env = this.config.get<string>(ENV.ENVIRONMENT)
  }

  async register(dto: AuthRegisterDto): Promise<UserWithTokens> {
    const _dto = { ...dto, email: dto.email.trim() }

    const existUser = await this.userService.byEmail(dto.email)

    if (existUser) throw new BadRequestException('User already exists')

    const user = await this.prisma.user.create({
      data: {
        email: _dto.email,
        password: await hash(_dto.password),
        name: faker.person.firstName(),
        avatar: faker.image.avatar(),
        phone: faker.phone.number(ENV.PHONE_NUMBER_FORMAT),
      },
    })

    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  async login(credentials: UserCredentials): Promise<UserWithTokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: credentials.id,
      },
    })

    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }
  async refreshTokens(user: UserCredentials): Promise<string> {
    console.log(user)
    const { accessToken } = await this.issueTokens(user.id)

    return cookieToString(this.getCookieWithAccessToken(accessToken))
  }

  private async issueTokens(userId: number): Promise<Tokens> {
    const accessTokenExpiration = this.config.get<number>(
      ENV.JWT_ACCESS_EXPIRATION,
    )

    const refreshTokenExpiration = this.config.get<number>(
      ENV.JWT_REFRESH_EXPIRATION,
    )

    const data = { id: userId }

    const accessToken = this.jwt.sign(data, {
      expiresIn: `${accessTokenExpiration}s`,
    })

    const refreshToken = this.jwt.sign(data, {
      expiresIn: `${refreshTokenExpiration}s`,
      secret: this.config.get<string>(ENV.JWT_REFRESH_SECRET),
    })

    return { accessToken, refreshToken }
  }

  public returnUserFields(user: User): UserCredentials {
    return {
      id: user.id,
      email: user.email,
    }
  }

  public async validateUser(dto: AuthRegisterDto): Promise<User> {
    const user = await this.userService.byEmail(dto.email)

    if (!user) throw new NotFoundException('User not found')

    const isValid = await verify(user.password, dto.password)

    if (!isValid) throw new UnauthorizedException('Invalid password')

    return user
  }

  public getCookiesWithTokens(
    access: string,
    refresh: string,
  ): {
    access: string
    refresh: string
  } {
    return {
      access: cookieToString(this.getCookieWithAccessToken(access)),
      refresh: cookieToString(this.getCookieWithRefreshToken(refresh)),
    }
  }

  /**
   * Создание куки с токеном авторизации
   * @returns {string} cookie Авторизационные куки
   * @param {string} token Сгенерированный токен
   */
  private getCookieWithAccessToken(token: string): Cookie {
    const tokenExpiration = this.config.get<number>(ENV.JWT_ACCESS_EXPIRATION)

    return {
      key: 'Authentication',
      value: token,
      httpOnly: true,
      secure: this.env !== ENVIRONMENT.DEVELOPMENT,
      path: '/',
      maxAge: tokenExpiration,
    }
  }

  /**
   * Создание куки с токеном обновления
   * @returns {string} cookie Куки с токеном обновления
   * @param {string} token Сгенерированный токен
   */
  private getCookieWithRefreshToken(token: string): CookieWithExpiration {
    const tokenExpiration = this.config.get<number>(ENV.JWT_REFRESH_EXPIRATION)

    return {
      key: 'Refresh',
      value: token,
      httpOnly: true,
      secure: this.env !== ENVIRONMENT.DEVELOPMENT,
      maxAge: tokenExpiration,
      path: '/auth/refresh',
      expiration: moment(new Date()).add(tokenExpiration, 's').toDate(),
    }
  }

  /**
   * Получение куки для выхода из системы
   * @returns {string[]} cookies Куки для выхода
   */
  public getCookiesForLogout() {
    return [
      `Authentication=; HttpOnly; ${
        this.env !== ENVIRONMENT.DEVELOPMENT ? 'Secure; ' : ''
      }Path=/; Max-Age=0`,
      `Refresh=; HttpOnly; ${
        this.env !== ENVIRONMENT.DEVELOPMENT ? 'Secure; ' : ''
      }Path=/auth/refresh; Max-Age=0`,
    ]
  }
}
