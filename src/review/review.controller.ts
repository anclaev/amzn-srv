import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger'
import { Review, User } from '@prisma/client'

import { CurrentUser } from '@decorators/current-user'
import { Validation } from '@decorators/validation'
import { Auth } from '@decorators/auth'

import { ReviewService } from './review.service'
import { ReviewDto } from './review.dto'

@ApiTags('Отзывы')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({
    summary: 'Получение всех отзывов',
  })
  @Validation()
  @Get()
  async getAll(): Promise<Review[]> {
    return await this.reviewService.getAll()
  }

  @ApiOperation({
    summary: 'Получение отзыва по ID',
  })
  @ApiQuery({
    name: 'id',
    description: 'ID отзыва',
    type: 'number',
  })
  @Get(':reviewId')
  async getReview(@Param('reviewId') id: number): Promise<Review> {
    return await this.reviewService.byId(Number(id))
  }

  @ApiOperation({
    summary: 'Создание отзыва',
  })
  @ApiBody({
    type: ReviewDto,
  })
  @ApiQuery({
    name: 'productId',
    description: 'ID товара',
    type: 'number',
  })
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

  @ApiOperation({
    summary: 'Получение рейтинга товара',
  })
  @ApiQuery({
    name: 'productId',
    description: 'ID товара',
    type: 'number',
  })
  @Validation()
  @Get('rating/:productId')
  async getRating(
    @Param('productId') productId: number,
  ): Promise<{ rating: number }> {
    return await this.reviewService.getAverageValueByProductId(
      Number(productId),
    )
  }

  @ApiOperation({
    summary: 'Удаление отзыва',
  })
  @ApiQuery({
    name: 'reviewId',
    description: 'ID отзыва',
    type: 'number',
  })
  @Auth()
  @Delete(':reviewId')
  async deleteReview(
    @Param('reviewId') reviewId: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.reviewService.remove(Number(reviewId), user)
  }

  @ApiOperation({
    summary: 'Изменение отзыва',
  })
  @ApiBody({
    type: ReviewDto,
  })
  @ApiQuery({
    name: 'reviewId',
    description: 'ID отзыва',
    type: 'number',
  })
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
