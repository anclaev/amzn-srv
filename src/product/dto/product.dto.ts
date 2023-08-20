import { ArrayMinSize, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'

export class ProductDto implements Prisma.ProductUpdateInput {
  @ApiProperty({ required: false })
  @IsString()
  name: string

  @ApiProperty({ required: false })
  @IsNumber()
  price: number

  @ApiProperty({ required: false })
  @IsString()
  description: string

  @ApiProperty({ required: false, isArray: true, type: String })
  @IsString({ each: true })
  @ArrayMinSize(1)
  images: string[]

  @ApiProperty({ required: false })
  @IsNumber()
  categoryId: number
}
