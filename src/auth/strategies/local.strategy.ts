import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-local'

import { UserCredentials } from '@common/types'

import { AuthService } from '../auth.service'

/**
 * Стратегия для авторизации по логину и паролю
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Конструктор стратегии
   * @param {AuthService} authService Сервис для работы с авторизацией
   */
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    })
  }

  /**
   * Метод валидации пользователя
   * @param {string} email Логин
   * @param {string} password Пароль
   * @returns {Auth} user Авторизационные данные пользователя
   */
  async validate(email: string, password: string): Promise<UserCredentials> {
    const user = await this.authService.validateUser({
      email,
      password,
    })

    return this.authService.returnUserFields(user)
  }
}
