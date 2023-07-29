import { Prisma } from '@prisma/client'

import { returnUser } from '@/user/objects/return-user'

export const returnReview: Prisma.ReviewSelect = {
  user: {
    select: returnUser,
  },
  product: {
    select: {
      id: true,
    },
  },
  createdAt: true,
  text: true,
  rating: true,
  id: true,
}
