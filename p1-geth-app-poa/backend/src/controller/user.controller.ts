import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AddUserDto, OkDto, UserDto } from '../dto';
import { UserService } from '../service';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOkResponse({ type: UserDto, isArray: true })
    @Get()
    async getUsers(): Promise<UserDto[]> {
        return this.userService.getUsers();
    }

    @ApiCreatedResponse({ type: OkDto })
    @Post()
    async addUser(@Body() body: AddUserDto): Promise<OkDto> {
        await this.userService.addUser(body);
        return { ok: true };
    }
}
