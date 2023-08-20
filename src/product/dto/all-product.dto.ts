import { IsEnum, IsOptional, IsString } from 'class-validator'

import { PaginationDto } from '@common/pagination.service'
import { PRODUCT_SORT } from '@common/enums'
import { ApiProperty } from '@nestjs/swagger'

export class AllProductDto extends PaginationDto {
  @ApiProperty({
    name: 's',
    description: ' Метод сортировки',
    enum: PRODUCT_SORT,
  })
  @IsOptional()
  @IsEnum(PRODUCT_SORT)
  s?: PRODUCT_SORT

  @ApiProperty({
    name: 't',
    description: 'Текст для поиска',
  })
  @IsOptional()
  @IsString()
  t?: string
}
