import { Module } from '@nestjs/common'

import { ProductModule } from '@/product/product.module'

import { PrismaService } from '@/prisma/prisma.service'

import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [ProductModule],
  controllers: [UserController],
  providers: [PrismaService, UserService],
  exports: [UserService],
})
export class UserModule {}
