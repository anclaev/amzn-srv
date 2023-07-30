import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { EnumUserRole } from '@prisma/client'

import JwtAuthGuard from '@/auth/guards/jwt-auth.guard'
import { RoleGuard } from '@/auth/guards/role.guard'

export const Auth = (roles?: EnumUserRole[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard),
    UseGuards(RoleGuard(roles)),
  )
