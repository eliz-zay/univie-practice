import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EProtocol } from '../../model';

class CreateNodeEndpointDto {
    @ApiProperty()
    @IsNumber()
    port: number;

    @ApiProperty({ enum: EProtocol, default: EProtocol.Http })
    @IsEnum(EProtocol)
    protocol: EProtocol;
}

export class CreateNodeRequest {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ type: CreateNodeEndpointDto, isArray: true })
    @ValidateNested()
    @Type(() => CreateNodeEndpointDto)
    endpoints: CreateNodeEndpointDto[];

    @ApiProperty()
    @IsString()
    dataDirId: string;

    @ApiProperty({ example: 30303 })
    @IsNumber()
    port: number;

    @ApiProperty({ example: 8551 })
    @IsNumber()
    authRpcPort: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    bootnodeId?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    minerAccountId?: string;
}
