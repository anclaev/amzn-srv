import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export const JwtAuth = UseGuards(AuthGuard('jwt'))
