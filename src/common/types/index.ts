import { FingerprintResult } from 'express-fingerprint'
import { Request as ExpressRequest } from 'express'
import { ProductPayload, User } from '@prisma/client'

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type Fingerprint = FingerprintResult

export type UserCredentials = Pick<User, 'id'> &
  Pick<User, 'email'> &
  Pick<User, 'role'>

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

export interface Request extends ExpressRequest {
  fingerprint: Fingerprint
}

export type CookieWithExpiration = Cookie & {
  expiration: Date
}

export type ReqUser = Request & {
  user: UserCredentials
}
