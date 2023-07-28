import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'

import { ConfigService } from '@/config/config.service'
import { PrismaService } from '@/prisma/prisma.service'

import { ENV } from '@common/enums'
import { User } from '@prisma/client'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies.Authentication
        },
      ]),
      secretOrKey: config.get<string>(ENV.JWT_ACCESS_SECRET),
    })
  }

  async validate({ id }: Pick<User, 'id'>) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }
}
