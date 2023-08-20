import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'

import { PaginationService } from '@common/pagination.service'
import { CategoryService } from '@/category/category.service'
import { PrismaService } from '@/prisma/prisma.service'

import { PRODUCT_SORT } from '@common/enums'

import { returnProduct, returnProductFullest } from './objects/return-product'
import { AllProductDto } from './dto/all-product.dto'
import { ProductDto } from './dto/product.dto'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
    private readonly categoryService: CategoryService,
  ) {}

  async getAll(dto: AllProductDto = {}) {
    // return this.prisma.product.findMany({
    //   select: returnProduct,
    // })
    const { s, t } = dto

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

    if (s === PRODUCT_SORT.LOW_PRICE) {
      prismaSort.push({ price: 'asc' })
    } else if (s === PRODUCT_SORT.HIGH_PRICE) {
      prismaSort.push({ price: 'desc' })
    } else if (s === PRODUCT_SORT.OLDEST) {
      prismaSort.push({ createdAt: 'asc' })
    } else {
      prismaSort.push({ createdAt: 'desc' })
    }

    const prismaSearchTermFilter: Prisma.ProductWhereInput = t
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: t,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: t,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: t,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}

    const { perPage, skip } = this.pagination.getPagination(dto)

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
    })

    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter,
      }),
    }
  }

  async byId(productId: number, fullest = false) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: !fullest ? returnProduct : returnProductFullest,
    })

    if (!product) throw new NotFoundException('Product not found')

    return product
  }

  async bySlug(name: string, fullest = false) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug: faker.helpers.slugify(name),
      },
      select: !fullest ? returnProduct : returnProductFullest,
    })

    if (!product) throw new NotFoundException('Product not found')

    return product
  }

  async byCategory(categorySlug: string, fullest = false) {
    return this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      select: !fullest ? returnProduct : returnProductFullest,
    })
  }

  async getSimilar(id: number, fullest = false) {
    const currentProduct = await this.byId(id, true)

    return this.prisma.product.findMany({
      where: {
        categoryId: currentProduct.category.id,
        NOT: {
          id: currentProduct.id,
        },
      },
      select: !fullest ? returnProduct : returnProductFullest,
    })
  }

  async create(dto: ProductDto) {
    const existsProduct = await this.prisma.product.findUnique({
      where: {
        slug: faker.helpers.slugify(dto.name),
      },
    })

    if (existsProduct) throw new BadRequestException('Product already exists')

    const category = await this.categoryService.byId(dto.categoryId)

    if (!category) throw new BadRequestException('Category not found')

    const { name, description, price, images } = dto

    return this.prisma.product.create({
      data: {
        description,
        images,
        price,
        name,
        slug: name ? faker.helpers.slugify(name) : existsProduct.name,
        category: {
          connect: {
            id: category.id,
          },
        },
      },
    })
  }

  async update(id: number, dto: ProductDto) {
    const product = await this.byId(id)
    const { name, description, price, images, categoryId } = dto

    return this.prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        description,
        images,
        price,
        name,
        slug: name ? faker.helpers.slugify(name) : product.name,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    })
  }

  async delete(id: number) {
    const product = await this.byId(id)

    return this.prisma.product.delete({
      where: {
        id: product.id,
      },
    })
  }
}
