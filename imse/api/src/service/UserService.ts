import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as infrastructure from '@/infrastructure';
import * as entities from '@/entity';
import * as repositories from '@/repository';

import * as types from '@/service/UserService.types';

@Injectable()
export class UserService {
  constructor(
    @infrastructure.InjectRepository(entities.User)
    private readonly userRepository: repositories.AbstractUserRepository,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async getUsersWithTokens(): Promise<types.UserJwt[]> {
    const users = await this.userRepository.find();

    return Promise.all(
      users.map(async (user) => ({
        user: { id: user.id, username: user.username },
        jwt: await this.jwtService.signAsync(
          { id: user.id },
          { secret: process.env.JWT_SECRET },
        ),
      })),
    );
  }

  async getUserIfExists(id: string): Promise<entities.User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    return user;
  }

  async getUserByUsername(username: string): Promise<entities.User> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found.`);
    }

    return user;
  }
}
