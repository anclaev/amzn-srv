import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'

import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger'

import { Validation } from '@decorators/validation'
import { Auth } from '@decorators/auth'

import { AllProductDto } from './dto/all-product.dto'
import { ProductDto } from './dto/product.dto'

import { ProductService } from './product.service'

@ApiTags('Товары')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Получение всех товаров',
  })
  @ApiQuery({
    name: 'page',
  })
  @Validation()
  @Get()
  async getAll(@Query() queryDto: AllProductDto) {
    return this.productService.getAll(queryDto)
  }

  @ApiOperation({
    summary: 'Получение похожих товаров',
    description: 'Получение товаров из смежной категории',
  })
  @ApiQuery({
    name: 'id',
    description: 'ID товара',
    type: 'number',
  })
  @Validation()
  @Get('similar/:id')
  async getSimilar(@Param('id') id: number) {
    return this.productService.getSimilar(Number(id))
  }

  @ApiOperation({
    summary: 'Получение товара по короткому имени',
  })
  @ApiQuery({
    name: 'slug',
    description: 'Короткое имя товара',
  })
  @Validation()
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return await this.productService.bySlug(slug)
  }

  @ApiOperation({
    summary: 'Получение товаров по категории',
  })
  @ApiQuery({
    name: 'slug',
    description: 'Короткое имя категории',
    type: 'string',
  })
  @Validation()
  @Get('category/:slug')
  async getByCategory(@Param('slug') categorySlug: string) {
    return this.productService.byCategory(categorySlug)
  }

  @ApiOperation({
    summary: 'Изменение товара',
  })
  @ApiBody({
    type: ProductDto,
  })
  @ApiQuery({
    name: 'id',
    description: 'ID товара',
    type: 'number',
  })
  @Validation()
  @Auth()
  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() dto: ProductDto) {
    return await this.productService.update(Number(id), dto)
  }

  @ApiOperation({
    summary: 'Создание товара',
  })
  @ApiBody({
    type: ProductDto,
  })
  @Validation()
  @Auth()
  @Post()
  async createProduct(@Body() dto: ProductDto) {
    return await this.productService.create(dto)
  }

  @ApiOperation({
    summary: 'Удаление товара',
  })
  @ApiQuery({
    name: 'id',
    description: 'ID товара',
    type: 'number',
  })
  @Validation()
  @Auth()
  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return await this.productService.delete(Number(id))
  }
}
