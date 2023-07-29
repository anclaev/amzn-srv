import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Category } from '@prisma/client'

import { Auth } from '@decorators/auth'
import { Validation } from '@decorators/validation'

import { CategoryService } from './category.service'
import { CategoryDto } from './category.dto'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Auth()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAll()
  }

  @Get('slug/:slug')
  @Auth()
  @Validation()
  async getCategoryBySlug(@Param('slug') slug: string): Promise<Category> {
    return await this.categoryService.bySlug(slug)
  }

  @Get(':id')
  @Auth()
  @Validation()
  async getCategoryById(@Param('id') id: number): Promise<Category> {
    return await this.categoryService.byId(Number(id))
  }

  @Post()
  @Auth()
  @Validation()
  async createCategory(@Body() dto: CategoryDto): Promise<Category> {
    return await this.categoryService.create(dto)
  }

  @Put(':id')
  @Auth()
  @Validation()
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: CategoryDto,
  ): Promise<Category> {
    return await this.categoryService.update(Number(id), dto)
  }

  @Delete(':id')
  @Auth()
  @Validation()
  async deleteCategory(@Param('id') id: number): Promise<Category> {
    return await this.categoryService.delete(Number(id))
  }
}
