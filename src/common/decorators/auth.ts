import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'

import JwtAuthGuard from '@/auth/guards/jwt-auth.guard'
import { RoleGuard } from '@/auth/guards/role.guard'

import { ROLE } from '@common/enums'

export const Auth = (roles?: ROLE[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard),
    UseGuards(RoleGuard(roles)),
  )
