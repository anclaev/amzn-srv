import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '@/user/user.module'
import { ConfigModule } from '@/config/config.module'
import { ConfigService } from '@/config/config.service'

import { PrismaService } from '@/prisma/prisma.service'

import { SessionService } from '@/auth/session.service'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtRefreshStrategy } from '@/auth/strategies/jwt-refresh.strategy'

import { jwtConfig } from '@utils/jwt-config'

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    PrismaService,
    ConfigService,
    SessionService,
  ],
})
export class AuthModule {}
