import { Injectable, NotFoundException } from '@nestjs/common'
import { Session } from '@prisma/client'

import { PrismaService } from '@/prisma/prisma.service'
import { ConfigService } from '@/config/config.service'

import { Fingerprint } from '@common/types'
import { ENV } from '@common/enums'
import { generateUserAgent } from '@utils/generate-user-agent'

@Injectable()
export class SessionService {
  private readonly maxSessions: number
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.maxSessions = this.config.get<number>(ENV.MAX_USER_SESSIONS)
  }

  public async getSession(token: string): Promise<Session> {
    return this.prisma.session.findUnique({
      where: {
        token: token,
      },
    })
  }
  public async getSessionByFingerprint(
    fingerprint: Fingerprint,
  ): Promise<Session> {
    return this.prisma.session.findUnique({
      where: {
        fingerprint: fingerprint.hash,
      },
    })
  }

  public async createSession({
    userId,
    fingerprint,
    token,
  }: SessionData): Promise<Session> {
    return this.prisma.session.create({
      data: {
        token,
        fingerprint: fingerprint.hash,
        userAgent: generateUserAgent(fingerprint),
        userId,
      },
    })
  }

  public async removeSession(token): Promise<Session> {
    const session = await this.getSession(token)

    if (!session) throw new NotFoundException('Session not found')
    return this.prisma.session.delete({
      where: {
        token,
      },
    })
  }

  public async addSession(data: SessionData): Promise<Session> {
    const existsSession = await this.prisma.session.findUnique({
      where: {
        fingerprint: data.fingerprint.hash,
      },
    })

    if (existsSession) {
      return this.prisma.session.update({
        where: {
          fingerprint: data.fingerprint.hash,
        },
        data: { token: data.token },
      })
    }

    const currentSessions = await this.prisma.session.findMany({
      where: {
        userId: data.userId,
      },
    })

    if (currentSessions.length >= this.maxSessions) {
      const oldSession = currentSessions
        .sort(
          (s1, s2) =>
            new Date(s1.createdAt).getTime() - new Date(s2.createdAt).getTime(),
        )
        .splice(0, 1)

      await this.removeSession(oldSession[0].token)
    }

    return await this.createSession(data)
  }
}

export type SessionData = {
  userId: number
  token: string
  fingerprint: Fingerprint
}
