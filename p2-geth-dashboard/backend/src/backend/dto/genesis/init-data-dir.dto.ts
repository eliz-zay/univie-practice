import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InitDataDirDto {
    @ApiProperty()
    @IsString()
    genesisId: string;

    @ApiProperty()
    @IsString()
    name: string;
}