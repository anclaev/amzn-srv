import { IsOptional, IsString } from 'class-validator'

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
  @IsOptional()
  @IsString()
  page?: string

  @IsOptional()
  @IsString()
  perPage?: string
}
