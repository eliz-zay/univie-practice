import { Controller, Get } from '@nestjs/common';

import * as services from '@/service';
import * as types from '@/service/UserService.types';

@Controller('user')
export class UserController {
  constructor(private userService: services.UserService) {}

  @Get()
  getUsers(): Promise<types.UserJwt[]> {
    return this.userService.getUsersWithTokens();
  }
}
