import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
} from '@nestjs/common'

import { User } from '@prisma/client'

import { CurrentUser } from '@decorators/current-user'
import { Validation } from '@decorators/validation'
import { JwtAuth } from '@decorators/jwt-auth'

import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'

@Controller('user')
export class UserController {
  @JwtAuth()
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: number): Promise<User> {
    return (await this.userService.byId(userId)) as User
  }

  constructor(private readonly userService: UserService) {}

  @Validation()
  @HttpCode(200)
  @JwtAuth()
  @Put('profile')
  async updateProfile(
    @CurrentUser('id') id: number,
    @Body() dto: UserDto,
  ): Promise<User> {
    return await this.userService.updateProfile(id, dto)
  }

  @HttpCode(200)
  @JwtAuth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId: number,
    @Param('productId') productId: number,
  ) {
    return await this.userService.toggleFavorite(userId, productId)
  }
}
