import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Проверка авторизации пользователя по логину и паролю
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
