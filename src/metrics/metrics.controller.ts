import { Controller, Get, Param } from '@nestjs/common'

import { Auth } from '@decorators/auth'

import { MetricsService } from './metrics.service'

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('consumer/:userId')
  @Auth()
  async getConsumerStatistic(@Param('userId') id: number) {
    return await this.metricsService.getConsumerStatistics(Number(id))
  }
}
