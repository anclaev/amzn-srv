import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { Injectable } from '@nestjs/common'

@Injectable()
export class PaginationService {
  getPagination(dto: PaginationDto, defaultPerPage = 30) {
    const page = Number(dto.page ? dto.page : 1)
    const perPage = Number(dto.perPage ? dto.perPage : defaultPerPage)

    const skip = (page - 1) * perPage

    return { perPage, skip }
  }
}

export class PaginationDto {
  @ApiProperty({
    name: 'page',
    description: 'Текущая страница',
  })
  @IsOptional()
  @IsString()
  page?: string

  @ApiProperty({
    name: 'perPage',
    description: 'Количество элементов на странице',
  })
  @IsOptional()
  @IsString()
  perPage?: string
}
