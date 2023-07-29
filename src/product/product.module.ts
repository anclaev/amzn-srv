import { Module } from '@nestjs/common'

import { ProductService } from './product.service'
import { ProductController } from './product.controller'

import { CategoryService } from '@/category/category.service'
import { PaginationService } from '@common/pagination.service'
import { PrismaService } from '@/prisma/prisma.service'

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    PaginationService,
    CategoryService,
  ],
  exports: [ProductService],
})
export class ProductModule {}
