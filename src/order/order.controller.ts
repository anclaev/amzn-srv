import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { User } from '@prisma/client'

import { CurrentUser } from '@decorators/current-user'
import { Validation } from '@decorators/validation'
import { Auth } from '@decorators/auth'

import { OrderService } from './order.service'
import { OrderDto } from '@/order/order.dto'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Validation()
  @Auth()
  @Get()
  async getAll(@CurrentUser('id') userId: number) {
    return this.orderService.getAll(Number(userId))
  }

  @Validation()
  @Auth()
  @Post()
  async placeOrder(@Body() dto: OrderDto, @CurrentUser('id') userId: number) {
    return await this.orderService.placeOrder(dto, Number(userId))
  }

  @Validation()
  @Auth()
  @Delete(':id')
  async deleteOrder(@Param('id') id: number, @CurrentUser() user: User) {
    return await this.orderService.delete(Number(id), user)
  }
}
