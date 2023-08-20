import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'

import fingerprint from 'express-fingerprint'
import cookieParser from 'cookie-parser'

import { ENV } from '@common/enums'
import { docBuilder, swaggerConfig } from '@common/utils/swagger'

import { AppModule } from './app.module'

import { PrismaService } from '@/prisma/prisma.service'
import { ConfigService } from '@/config/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config: ConfigService = app.get(ConfigService)

  const APP_PREFIX = config.get<string | null>(ENV.APP_PREFIX)
  const COOKIE_SECRET = config.get<string>(ENV.COOKIE_SECRET)
  const API_PATH = config.get<string>(ENV.API_PATH)
  const APP_VERSION = config.app_version
  const APP_PORT = config.port

  app.use(cookieParser(COOKIE_SECRET))

  const logger = new Logger(config.app_name)

  const apiDoc = SwaggerModule.createDocument(app, docBuilder(APP_VERSION))

  const prisma: PrismaService = app.get(PrismaService)
  await prisma.enableShutdownHooks(app)

  if (APP_PREFIX) app.setGlobalPrefix(APP_PREFIX)

  app.enableCors({
    credentials: true,
  })

  const expressInstance = app.getHttpAdapter().getInstance()
  expressInstance.use(fingerprint())

  SwaggerModule.setup(API_PATH, app, apiDoc, swaggerConfig)

  await app
    .listen(APP_PORT)
    .finally(() =>
      logger.log(`Приложение успешно запущено на порту ${APP_PORT}!`),
    )
}

bootstrap()
