import * as Joi from '@hapi/joi'

import { ENVIRONMENT } from '@common/enums'

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  PORT: Joi.number().default(4200),
  COOKIE_SECRET: Joi.string().required(),
  SENTRY_DSN: Joi.string().required(),
  APP_NAME: Joi.string().default('Nest'),
  APP_HOST: Joi.string().default('localhost'),
  APP_PREFIX: Joi.string().default(null),
  ENVIRONMENT: Joi.string()
    .valid(ENVIRONMENT.DEVELOPMENT, ENVIRONMENT.STAGING, ENVIRONMENT.PRODUCTION)
    .default(ENVIRONMENT.DEVELOPMENT),
})
