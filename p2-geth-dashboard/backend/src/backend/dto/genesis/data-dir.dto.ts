import { ApiProperty } from '@nestjs/swagger';

export class DataDirDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    dir: string;
}
