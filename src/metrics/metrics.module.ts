import { Module } from '@nestjs/common'
import { MetricsService } from './metrics.service'
import { MetricsController } from './metrics.controller'

import { UserModule } from '@/user/user.module'

import { PrismaService } from '@/prisma/prisma.service'

@Module({
  imports: [UserModule],
  controllers: [MetricsController],
  providers: [MetricsService, PrismaService],
})
export class MetricsModule {}
