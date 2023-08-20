import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { Controller, Get, Param } from '@nestjs/common'

import { Auth } from '@decorators/auth'

import { MetricsService } from './metrics.service'

@ApiTags('Метрика')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @ApiOperation({
    summary: 'Получение статистики пользователя по ID',
  })
  @ApiQuery({
    name: 'userId',
    description: 'ID пользователя',
    type: 'number',
    required: true,
  })
  @Get('consumer/:userId')
  @Auth()
  async getConsumerStatistic(@Param('userId') id: number) {
    return await this.metricsService.getConsumerStatistics(Number(id))
  }
}
