import {
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator'

import { EnumOrderStatus } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class OrderItemDto {
  @ApiProperty()
  @IsNumber()
  quantity: number

  @ApiProperty()
  @IsNumber()
  price: number

  @ApiProperty()
  @IsNumber()
  productId: number
}

export class OrderDto {
  @ApiProperty({
    enum: EnumOrderStatus,
  })
  @IsOptional()
  @IsEnum(EnumOrderStatus)
  status: EnumOrderStatus

  @ApiProperty({ isArray: true, type: OrderItemDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]
}
