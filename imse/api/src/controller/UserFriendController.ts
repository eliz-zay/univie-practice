import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoggedInRequest } from '@/jwt.strategy';
import * as services from '@/service';
import * as entities from '@/entity';

@UseGuards(AuthGuard('jwt'))
@Controller('friend')
export class UserFriendController {
  constructor(private userFriendService: services.UserFriendService) { }

  @Get()
  getFriends(@Req() req: LoggedInRequest): Promise<entities.UserFriendFull[]> {
    return this.userFriendService.getFriends(req.user);
  }
}
