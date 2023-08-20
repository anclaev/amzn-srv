import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
} from '@nestjs/common'

import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger'
import { User } from '@prisma/client'

import { CurrentUser } from '@decorators/current-user'
import { Validation } from '@decorators/validation'
import { Auth } from '@decorators/auth'

import { UserService } from './user.service'
import { UserDto } from './user.dto'

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Получение своего профиля',
  })
  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: number): Promise<User> {
    return (await this.userService.byId(userId)) as User
  }

  @ApiOperation({
    summary: 'Изменение профиля',
  })
  @ApiBody({
    type: UserDto,
  })
  @Validation()
  @HttpCode(200)
  @Auth()
  @Put('profile')
  async updateProfile(
    @CurrentUser('id') id: number,
    @Body() dto: UserDto,
  ): Promise<User> {
    return await this.userService.updateProfile(id, dto)
  }

  @ApiOperation({
    summary: 'Изменение товара в избранном пользователя',
  })
  @ApiQuery({
    name: 'productId',
    description: 'ID товара',
    type: 'number',
  })
  @HttpCode(200)
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId: number,
    @Param('productId') productId: number,
  ) {
    return await this.userService.toggleFavorite(userId, Number(productId))
  }
}
