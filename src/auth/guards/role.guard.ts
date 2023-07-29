import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common'

import { ReqUser } from '@common/types'
import { ROLE } from '@common/enums'

export const RoleGuard = (roles?: ROLE[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<ReqUser>()
      const user = request.user
      console.log(user.role, roles)
      if (roles) return roles.includes(user.role as ROLE)

      return true
    }
  }

  return mixin(RoleGuardMixin)
}
