import { ProductPayload, User } from '@prisma/client'
import { Request } from 'express'

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type UserCredentials = Pick<User, 'id'> & Pick<User, 'email'>

export type UserWithTokens = { user: UserCredentials } & Tokens

export type UserWithFavorites = User & {
  favorites: ProductPayload[]
}

export type Cookie = {
  key: string
  value: string
  httpOnly: boolean
  secure: boolean
  path: string
  maxAge: number
}

export type CookieWithExpiration = Cookie & {
  expiration: Date
}

export type ReqUser = Request & {
  user: UserCredentials
}
