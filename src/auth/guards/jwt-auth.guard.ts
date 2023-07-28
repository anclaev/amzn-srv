import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Проверка авторизации пользователя через JWT-токен
 */
@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {}
