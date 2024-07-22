import { ApiProperty } from '@nestjs/swagger';
import { AccountDto, DataDirDto } from '..';

export class GenesisAccountDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ type: AccountDto })
    account: AccountDto;

    @ApiProperty()
    isSigner: boolean;
}

class GenesisNodeDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;
}

class GenesisDataDirDto extends DataDirDto {
    @ApiProperty({ type: GenesisNodeDto })
    node?: GenesisNodeDto;
}

export class GenesisJsonListDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    networkId: string;

    @ApiProperty()
    filePath: string;

    @ApiProperty({ type: GenesisDataDirDto, isArray: true })
    dataDirs: GenesisDataDirDto[];

    @ApiProperty({ type: GenesisAccountDto, isArray: true })
    accounts: GenesisAccountDto[];
}
