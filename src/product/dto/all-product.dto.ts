import { IsEnum, IsOptional, IsString } from 'class-validator'

import { PaginationDto } from '@common/pagination.service'
import { PRODUCT_SORT } from '@common/enums'

export class AllProductDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PRODUCT_SORT)
  s?: PRODUCT_SORT

  @IsOptional()
  @IsString()
  t?: string
}
