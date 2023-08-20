import { IsNumber, IsString, Max, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ReviewDto {
  @ApiProperty({
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @ApiProperty()
  @IsString()
  text: string
}
