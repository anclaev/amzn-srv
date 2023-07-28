import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { faker } from '@faker-js/faker'
import { Category } from '@prisma/client'

import { PrismaService } from '@/prisma/prisma.service'

import { returnCategoryObject } from './objects/return-category'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  public async byId(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      select: returnCategoryObject,
    })

    if (!category) throw new NotFoundException('Category not found')

    return category as Category
  }

  public async bySlug(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: {
        slug,
      },
    })

    if (!category) throw new NotFoundException('Category not found')

    return category as Category
  }

  public async getAll(): Promise<Category[]> {
    return (await this.prisma.category.findMany({
      select: returnCategoryObject,
    })) as Category[]
  }

  public async update(id: number, dto: CategoryDto): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        slug: faker.helpers.slugify(dto.name).toLowerCase(),
      },
    })
  }

  public async create(dto: CategoryDto): Promise<Category> {
    const isExists = await this.prisma.category.findUnique({
      where: {
        slug: faker.helpers.slugify(dto.name).toLowerCase(),
      },
    })

    if (isExists) throw new BadRequestException('Category already exists')

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: faker.helpers.slugify(dto.name).toLowerCase(),
      },
    })
  }

  public async delete(id: number): Promise<Category> {
    const category = await this.byId(id)

    if (!category) throw new NotFoundException('Category not found')

    return this.prisma.category.delete({
      where: {
        id,
      },
    })
  }
}
