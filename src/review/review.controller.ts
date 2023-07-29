import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Review, User } from '@prisma/client'

import { CurrentUser } from '@decorators/current-user'
import { Validation } from '@decorators/validation'
import { Auth } from '@decorators/auth'

import { ReviewService } from './review.service'
import { ReviewDto } from './review.dto'

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Validation()
  @Get()
  async getAll(): Promise<Review[]> {
    return await this.reviewService.getAll()
  }

  @Get(':reviewId')
  async getReview(@Param('reviewId') id: number): Promise<Review> {
    return await this.reviewService.byId(Number(id))
  }

  @Auth()
  @Validation()
  @Post('leave/:productId')
  async leaveReview(
    @CurrentUser('id') id: number,
    @Body() dto: ReviewDto,
    @Param('productId') productId: number,
  ) {
    return await this.reviewService.create(id, Number(productId), dto)
  }

  @Validation()
  @Get('rating/:productId')
  async getRating(
    @Param('productId') productId: number,
  ): Promise<{ rating: number }> {
    return await this.reviewService.getAverageValueByProductId(
      Number(productId),
    )
  }

  @Auth()
  @Delete(':reviewId')
  async deleteReview(
    @Param('reviewId') reviewId: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.reviewService.remove(Number(reviewId), user)
  }

  @Auth()
  @Put(':reviewId')
  async updateReview(
    @Param('reviewId') reviewId: number,
    @Body() dto: ReviewDto,
    @CurrentUser() user: User,
  ): Promise<Review> {
    return await this.reviewService.update(Number(reviewId), dto, user)
  }
}
