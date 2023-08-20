import { SwaggerCustomOptions, DocumentBuilder } from '@nestjs/swagger'

export const swaggerConfig: SwaggerCustomOptions = {
  customCss: `
    .topbar-wrapper img {
      opacity: 0 !important;
    }
  `,
  customSiteTitle: 'Amzn API',
}

export const docBuilder = (version: string) =>
  new DocumentBuilder()
    .setTitle('Amzn API')
    .setVersion(version)
    .setDescription('eCommerce app')
    .build()
