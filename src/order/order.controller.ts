import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { User } from '@prisma/client'

import { CurrentUser } from '@decorators/current-user'
import { Validation } from '@decorators/validation'
import { Auth } from '@decorators/auth'

import { OrderService } from './order.service'
import { OrderDto } from '@/order/order.dto'

@ApiTags('Заказы')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Получение всех заказов пользователя',
  })
  @ApiQuery({
    name: 'userId',
    description: 'ID пользователя',
    type: 'number',
    required: true,
  })
  @Validation()
  @Auth()
  @Get()
  async getAll(@CurrentUser('id') userId: number) {
    return this.orderService.getAll(Number(userId))
  }

  @ApiOperation({
    summary: 'Создание заказа',
  })
  @ApiBody({
    type: OrderDto,
  })
  @Validation()
  @Auth()
  @Post()
  async placeOrder(@Body() dto: OrderDto, @CurrentUser('id') userId: number) {
    return await this.orderService.placeOrder(dto, Number(userId))
  }

  @ApiOperation({
    summary: 'Удаление заказа',
  })
  @ApiQuery({
    name: 'id',
    description: 'ID заказа',
    type: 'number',
  })
  @Validation()
  @Auth()
  @Delete(':id')
  async deleteOrder(@Param('id') id: number, @CurrentUser() user: User) {
    return await this.orderService.delete(Number(id), user)
  }
}
