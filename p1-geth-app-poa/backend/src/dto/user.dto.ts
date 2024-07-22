import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    username: string;
}

export class AddUserDto {
    @ApiProperty()
    @IsString()
    username: string;
}
