import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'

import { ConfigService } from '@/config/config.service'
import { PrismaService } from '@/prisma/prisma.service'

import { ENV } from '@/common/enums'
import { User } from '@prisma/client'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get<string>(ENV.JWT_SECRET),
    })
  }

  async validate({ id }: Pick<User, 'id'>) {
   return this.prisma.user.findUnique({
     where: {
       id
     }
   })
  }
}
