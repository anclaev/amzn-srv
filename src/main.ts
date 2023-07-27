import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'

import { AppModule } from './app.module'

import { PrismaService } from '@common/prisma/prisma.service'
import { ConfigService } from '@/config/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config: ConfigService = app.get(ConfigService)

  const logger = new Logger(config.app_name)

  const prisma: PrismaService = app.get(PrismaService)
  await prisma.enableShutdownHooks(app)

  app.setGlobalPrefix('api')
  app.enableCors()

  await app
    .listen(config.port)
    .finally(() =>
      logger.log(`Приложение успешно запущено на порту ${config.port}!`),
    )
}

bootstrap()
