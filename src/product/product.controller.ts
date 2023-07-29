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

import { Validation } from '@decorators/validation'
import { Auth } from '@decorators/auth'

import { AllProductDto } from './dto/all-product.dto'
import { ProductDto } from './dto/product.dto'

import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Validation()
  @Get()
  async getAll(@Query() queryDto: AllProductDto) {
    return this.productService.getAll(queryDto)
  }

  @Validation()
  @Get('similar/:id')
  async getSimilar(@Param('id') id: number) {
    return this.productService.getSimilar(Number(id))
  }

  @Validation()
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return await this.productService.bySlug(slug)
  }

  @Validation()
  @Get('category/:slug')
  async getByCategory(@Param('slug') categorySlug: string) {
    return this.productService.byCategory(categorySlug)
  }

  @Validation()
  @Auth()
  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() dto: ProductDto) {
    return await this.productService.update(Number(id), dto)
  }

  @Validation()
  @Auth()
  @Post()
  async createProduct(@Body() dto: ProductDto) {
    return await this.productService.create(dto)
  }

  @Validation()
  @Auth()
  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return await this.productService.delete(Number(id))
  }
}
