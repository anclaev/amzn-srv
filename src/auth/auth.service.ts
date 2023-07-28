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

import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { AuthRegisterDto } from './dto/auth-register.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { AuthLoginDto } from '@/auth/dto/auth-login.dto'

import { Tokens, UserCredentials, UserWithTokens } from '@common/types'
import { ENV } from '@common/enums'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

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

  async login(dto: AuthLoginDto): Promise<UserWithTokens> {
    const user: User = await this.validateUser(dto)
    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }
  async refreshTokens({
    refreshToken,
  }: RefreshTokenDto): Promise<UserWithTokens> {
    const result = await this.jwt
      .verifyAsync<{ id: number }>(refreshToken)
      .catch(() => {
        throw new UnauthorizedException('Invalid refresh token')
      })

    const user = (await this.userService.byId(result.id)) as User
    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  private async issueTokens(userId: number): Promise<Tokens> {
    const data = { id: userId }

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    })

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    })

    return { accessToken, refreshToken }
  }

  private returnUserFields(user: User): UserCredentials {
    return {
      id: user.id,
      email: user.email,
    }
  }

  private async validateUser(dto: AuthRegisterDto): Promise<User> {
    const user = await this.userService.byEmail(dto.email)

    if (!user) throw new NotFoundException('User not found')

    const isValid = await verify(user.password, dto.password)

    if (!isValid) throw new UnauthorizedException('Invalid password')

    return user
  }
}
