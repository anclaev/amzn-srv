import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { EnumUserRole, Review, User } from '@prisma/client'

import { PrismaService } from '@/prisma/prisma.service'
import { ProductService } from '@/product/product.service'

import { returnReview } from './objects/return-review'
import { ReviewDto } from './review.dto'

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async byId(id: number): Promise<Review> {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
      },
      select: returnReview,
    })

    if (!review) throw new NotFoundException('Review not found')

    return review as Review
  }

  public async getAll(): Promise<Review[]> {
    return (await this.prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: returnReview,
    })) as Review[]
  }

  public async update(id: number, dto: ReviewDto, user: User): Promise<Review> {
    await this.checkAccess(id, user)

    return this.prisma.review.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    })
  }

  public async create(
    userId: number,
    productId: number,
    dto: ReviewDto,
  ): Promise<Review> {
    const product = await this.productService.byId(productId)

    if (!product) return null

    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: product.id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }

  public async delete(id: number): Promise<Review> {
    const Review = await this.byId(id)

    if (!Review) throw new NotFoundException('Review not found')

    return this.prisma.review.delete({
      where: {
        id,
      },
    })
  }

  public async remove(reviewId: number, user: User): Promise<boolean> {
    await this.checkAccess(reviewId, user)

    return !!(await this.delete(reviewId))
  }

  public getAverageValueByProductId(
    productId: number,
  ): Promise<{ rating: number }> {
    return this.prisma.review
      .aggregate({
        where: { productId: productId },
        _avg: { rating: true },
      })
      .then((data) => data._avg)
  }

  private async checkAccess(reviewId: number, user: User): Promise<boolean> {
    const review = await this.byId(reviewId)

    if (review['user'].id !== user.id && user.role === EnumUserRole.CONSUMER) {
      throw new ForbiddenException()
    }

    return true
  }
}
