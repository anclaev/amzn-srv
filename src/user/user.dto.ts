import { IsEmail, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string
}
