import { Injectable } from '@nestjs/common'

import { UserService } from '@/user/user.service'

import { ConsumerStatistic } from '@common/types'

@Injectable()
export class MetricsService {
  constructor(private readonly userService: UserService) {}

  async getConsumerStatistics(userId: number): Promise<ConsumerStatistic> {
    const user = await this.userService.byId(userId, {
      orders: {
        select: {
          items: true,
        },
      },
      reviews: true,
    })

    return {
      orders: user['orders'].length,
      reviews: user['reviews'].length,
      favorites: user['favorites'].length,
      totalAmount: 1000,
    }
  }
}
