import { HttpException, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { SentryInterceptor } from '@ntegral/nestjs-sentry'

import { ConfigModule } from './config/config.module'
import { SentryModule } from './sentry/sentry.module'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from '@common/common.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { ProductModule } from './product/product.module'
import { ReviewModule } from './review/review.module'
import { CategoryModule } from './category/category.module'
import { OrderModule } from './order/order.module'
import { PaginationModule } from './pagination/pagination.module'
import { MetricsModule } from './metrics/metrics.module'

@Module({
  imports: [
    ConfigModule,
    SentryModule,
    CommonModule,
    PaginationModule,
    PrismaModule,
    UserModule,
    AuthModule,
    ProductModule,
    ReviewModule,
    CategoryModule,
    OrderModule,
    MetricsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exp: HttpException) => 500 > exp.getStatus(),
            },
          ],
        }),
    },
  ],
})
export class AppModule {}
