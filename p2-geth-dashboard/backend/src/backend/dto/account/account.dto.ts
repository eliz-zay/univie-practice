import { ApiProperty } from '@nestjs/swagger';

export class AccountDto {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    name: string;

    @ApiProperty()
    secretKeyPath: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    password: string;
}
