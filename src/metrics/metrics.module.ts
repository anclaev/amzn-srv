import { Module } from '@nestjs/common'
import { MetricsService } from './metrics.service'
import { MetricsController } from './metrics.controller'

import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

@Module({
  controllers: [MetricsController],
  providers: [MetricsService, PrismaService, UserService],
})
export class MetricsModule {}
