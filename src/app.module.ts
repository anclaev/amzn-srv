import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { ConfigModule } from './config/config.module'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from '@common/common.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { PaginationModule } from './pagination/pagination.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [ConfigModule, CommonModule, PrismaModule, UserModule, AuthModule, ProductModule, ReviewModule, CategoryModule, OrderModule, PaginationModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
