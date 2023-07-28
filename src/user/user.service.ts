import { Injectable } from '@nestjs/common'

import { User } from '@prisma/client'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async getByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  public async getById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  private mutate(user: User): Omit<User, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...profile } = user

    return profile
  }
}
