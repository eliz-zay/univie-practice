import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';

class GenesisAccountDto {
    @ApiProperty()
    @IsString()
    accountId: string;

    @ApiProperty()
    @IsString()
    balance: string;

    @ApiProperty()
    @IsBoolean()
    isSigner: boolean;
}

export class CreateGenesisJsonDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    networkId: string;

    @ApiProperty()
    @IsNumber()
    cliquePeriod: number;

    @ApiProperty()
    @IsString()
    gasLimit: string;

    @ApiProperty({ type: GenesisAccountDto, isArray: true, minItems: 1, description: 'Must include at least 1 signer account' })
    @ArrayMinSize(1)
    @ValidateNested()
    @Type(() => GenesisAccountDto)
    accounts: GenesisAccountDto[];
}
