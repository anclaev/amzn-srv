import { UseGuards } from '@nestjs/common'

import JwtAuthGuard from '@/auth/guards/jwt-auth.guard'

export const Auth = () => UseGuards(JwtAuthGuard)
