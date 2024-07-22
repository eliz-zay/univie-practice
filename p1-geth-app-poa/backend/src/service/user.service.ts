import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { AddUserDto, UserDto } from '../dto';
import { userModel } from '../model';

@Injectable()
export class UserService {
    async getUsers(): Promise<UserDto[]> {
        return userModel.find();
    }

    async addUser(dto: AddUserDto): Promise<void> {
        const duplicate = await userModel.findOne({ username: dto.username });
        if (duplicate) {
            throw new BadRequestException('This username is already taken');
        }

        await userModel.create({ username: dto.username });
    }

    async validateUser(id: string): Promise<void> {
        const user = await userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
    }
}
