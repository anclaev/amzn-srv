import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Prisma, User } from '@prisma/client'
import { hash } from 'argon2'

import { PrismaService } from '@/prisma/prisma.service'
import { ProductService } from '@/product/product.service'

import { returnUser } from '@/user/objects/return-user'
import { UserDto } from '@/user/user.dto'

import { UserWithFavorites } from '@common/types'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async byEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  public async byId(
    id: number,
    selectObject: Prisma.UserSelect = {},
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...returnUser,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            slug: true,
            images: true,
          },
        },
        ...selectObject,
      },
    })

    if (!user) throw new NotFoundException('User not found')

    return user as User
  }

  public async updateProfile(id: number, dto: UserDto): Promise<User> {
    const isSameUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })

    if (isSameUser && id !== isSameUser.id)
      throw new BadRequestException('Email already in use')

    const user = await this.byId(id, { password: true })

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email: dto.email,
        name: dto.name,
        avatar: dto.avatar,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : user.password,
      },
    })
  }

  public async toggleFavorite(id: number, productId: number): Promise<boolean> {
    const user = (await this.byId(id)) as UserWithFavorites

    const product = await this.productService.byId(productId)

    if (!product) return null

    const isExists = user.favorites.some(
      (product) => product,
      id === product.id,
    )

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        favorites: {
          [isExists ? 'disconnect' : 'connect']: {
            id: product.id,
          },
        },
      },
    })

    return true
  }
}
