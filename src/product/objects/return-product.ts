import { Prisma } from '@prisma/client'

import { returnReview } from '@/review/objects/return-review'
import { returnCategory } from '@/category/objects/return-category'

export const returnProduct: Prisma.ProductSelect = {
  images: true,
  description: true,
  id: true,
  name: true,
  price: true,
  createdAt: true,
  slug: true,
}

export type ProductSelect = typeof returnProduct

export const returnProductFullest: Prisma.ProductSelect = {
  ...returnProduct,
  reviews: {
    select: returnReview,
  },
  category: {
    select: returnCategory,
  },
}
