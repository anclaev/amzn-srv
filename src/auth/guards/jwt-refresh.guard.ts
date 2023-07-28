import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Проверка валидности токена обновления
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {}
