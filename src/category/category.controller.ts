import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger'

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Category } from '@prisma/client'

import { Auth } from '@decorators/auth'
import { Validation } from '@decorators/validation'

import { CategoryService } from './category.service'
import { CategoryDto } from './category.dto'

@ApiTags('Категории')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Получение всех категорий товаров',
  })
  @Get()
  @Auth()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAll()
  }

  @ApiOperation({
    summary: 'Получение категории по короткому имени',
  })
  @ApiQuery({
    name: 'slug',
    description: 'Короткое имя',
    type: 'string',
    required: true,
  })
  @Get('slug/:slug')
  @Auth()
  @Validation()
  async getCategoryBySlug(@Param('slug') slug: string): Promise<Category> {
    return await this.categoryService.bySlug(slug)
  }

  @ApiOperation({
    summary: 'Получение категории по ID',
  })
  @ApiQuery({
    name: 'id',
    description: 'ID категории',
    type: 'number',
    required: true,
  })
  @Get(':id')
  @Auth()
  @Validation()
  async getCategoryById(@Param('id') id: number): Promise<Category> {
    return await this.categoryService.byId(Number(id))
  }

  @ApiOperation({
    summary: 'Создание категории',
  })
  @ApiBody({
    type: CategoryDto,
  })
  @Post()
  @Auth()
  @Validation()
  async createCategory(@Body() dto: CategoryDto): Promise<Category> {
    return await this.categoryService.create(dto)
  }

  @ApiOperation({
    summary: 'Изменение категории',
  })
  @ApiQuery({
    name: 'id',
    description: 'ID категории',
    type: 'number',
    required: true,
  })
  @ApiBody({
    type: CategoryDto,
  })
  @Put(':id')
  @Auth()
  @Validation()
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: CategoryDto,
  ): Promise<Category> {
    return await this.categoryService.update(Number(id), dto)
  }

  @ApiOperation({
    summary: 'Удаление категории',
  })
  @ApiQuery({
    name: 'id',
    description: 'ID категории',
    type: 'number',
    required: true,
  })
  @Delete(':id')
  @Auth()
  @Validation()
  async deleteCategory(@Param('id') id: number): Promise<Category> {
    return await this.categoryService.delete(Number(id))
  }
}
