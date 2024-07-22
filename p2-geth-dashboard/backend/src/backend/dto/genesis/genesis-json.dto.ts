import { ApiProperty } from '@nestjs/swagger';
import { DataDirDto, GenesisAccountDto } from '..';

export class GenesisJsonDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    networkId: string;

    @ApiProperty({ type: DataDirDto, isArray: true })
    dataDirs: DataDirDto[];

    @ApiProperty({ type: GenesisAccountDto, isArray: true })
    accounts: GenesisAccountDto[];

    @ApiProperty()
    filePath: string;

    @ApiProperty()
    content: string;
}
