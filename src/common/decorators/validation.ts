import { applyDecorators, UsePipes, ValidationPipe } from '@nestjs/common'

export const Validation = () => applyDecorators(UsePipes(new ValidationPipe()))
