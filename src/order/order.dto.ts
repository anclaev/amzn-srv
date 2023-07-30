import {
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator'

import { EnumOrderStatus } from '@prisma/client'
import { Type } from 'class-transformer'

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus)
  status: EnumOrderStatus

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]
}

export class OrderItemDto {
  @IsNumber()
  quantity: number

  @IsNumber()
  price: number

  @IsNumber()
  productId: number
}
