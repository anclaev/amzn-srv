import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'

import { ProductModule } from '@/product/product.module'
import { UserModule } from '@/user/user.module'

import { PrismaService } from '@/prisma/prisma.service'

@Module({
  imports: [UserModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}
