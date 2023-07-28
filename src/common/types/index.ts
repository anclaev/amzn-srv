import { ProductPayload, User } from '@prisma/client'

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type UserCredentials = Pick<User, 'id'> & Pick<User, 'email'>

export type UserWithTokens = { user: UserCredentials } & Tokens

export type UserWithFavorites = User & {
  favorites: ProductPayload[]
}
