import { Prisma } from '@prisma/client'

export const returnUser: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  password: false,
  phone: true,
  role: true,
}
