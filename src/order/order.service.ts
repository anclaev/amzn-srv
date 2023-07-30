import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { ProductService } from '@/product/product.service'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { returnProduct } from '@/product/objects/return-product'

import { OrderDto, OrderItemDto } from '@/order/order.dto'
import { EnumUserRole, User } from '@prisma/client'

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

  async byId(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    if (!order) throw new NotFoundException('Order not found')

    return order
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

  async delete(orderId: number, user: User) {
    await this.checkAccess(orderId, user)

    return this.prisma.order.delete({
      where: {
        id: orderId,
      },
    })
  }

  private async checkOrderItems(items: OrderItemDto[]) {
    const acceptedItems = items.map(
      async (item) => await this.productService.byId(item.productId),
    )

    return Promise.all(acceptedItems)
  }

  private async checkAccess(orderId: number, user: User): Promise<boolean> {
    const order = await this.byId(orderId)

    if (order.userId !== user.id && user.role === EnumUserRole.CONSUMER) {
      throw new ForbiddenException()
    }

    return true
  }
}
