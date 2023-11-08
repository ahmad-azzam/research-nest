import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createBatchUser(users: CreateUserDto[]) {
    return await this.prismaService.user.createMany({ data: users });
  }
}
