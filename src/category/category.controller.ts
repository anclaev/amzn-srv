import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Category } from '@prisma/client'

import { JwtAuth } from '@decorators/jwt-auth'
import { Validation } from '@decorators/validation'

import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @JwtAuth()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAll()
  }

  @Get('slug/:slug')
  @JwtAuth()
  @Validation()
  async getCategoryBySlug(@Param('slug') slug: string): Promise<Category> {
    return await this.categoryService.bySlug(slug)
  }

  @Get(':id')
  @JwtAuth()
  @Validation()
  async getCategoryById(@Param('id') id: number): Promise<Category> {
    return await this.categoryService.byId(Number(id))
  }

  @Post()
  @JwtAuth()
  @Validation()
  async createCategory(@Body() dto: CategoryDto): Promise<Category> {
    return await this.categoryService.create(dto)
  }

  @Put(':id')
  @JwtAuth()
  @Validation()
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: CategoryDto,
  ): Promise<Category> {
    return await this.categoryService.update(Number(id), dto)
  }

  @Delete(':id')
  @JwtAuth()
  @Validation()
  async deleteCategory(@Param('id') id: number): Promise<Category> {
    return await this.categoryService.delete(Number(id))
  }
}
