import { Injectable } from '@nestjs/common'

import { ProductService } from '@/product/product.service'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { returnProduct } from '@/product/objects/return-product'

import { OrderDto, OrderItemDto } from '@/order/order.dto'

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async getAll(userId: number) {
    const user = await this.userService.byId(userId)

    if (!user) return null

    return this.prisma.order.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: {
              select: returnProduct,
            },
          },
        },
      },
    })
  }

  async placeOrder(dto: OrderDto, userId: number) {
    await this.checkOrderItems(dto.items)

    const user = await this.userService.byId(userId)

    if (!user) return

    return this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: dto.items,
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })
  }

  private async checkOrderItems(items: OrderItemDto[]) {
    const acceptedItems = items.map(
      async (item) => await this.productService.byId(item.productId),
    )

    return Promise.all(acceptedItems)
  }
}
