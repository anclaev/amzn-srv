import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common'
import { EnumUserRole } from '@prisma/client'

import { ReqUser } from '@common/types'

export const RoleGuard = (roles?: EnumUserRole[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<ReqUser>()
      const user = request.user

      if (roles) return roles.includes(user.role as EnumUserRole)

      return true
    }
  }

  return mixin(RoleGuardMixin)
}
