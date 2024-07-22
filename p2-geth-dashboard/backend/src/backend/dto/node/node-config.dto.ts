import { ApiProperty } from '@nestjs/swagger';
import { NodeEndpointDto } from './node-endpoint.dto';
import { AccountDto } from '..';

export class BootnodeDto {
    @ApiProperty({ description: 'ID of node' })
    id: string;

    @ApiProperty()
    name: string;
}

export class DataDirGenesisDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    networkId: string;
}

export class NodeDataDirDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    dir: string;

    @ApiProperty({ type: DataDirGenesisDto })
    genesis: DataDirGenesisDto;
}

export class NodeConfigDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    isRunning: boolean;

    @ApiProperty()
    pid: number;

    @ApiProperty()
    name: string;

    @ApiProperty({ type: NodeEndpointDto, isArray: true })
    endpoints: NodeEndpointDto[];

    @ApiProperty({ type: NodeDataDirDto })
    dataDir: NodeDataDirDto;

    @ApiProperty({ example: 30303 })
    port: number;

    @ApiProperty({ example: 8551 })
    authRpcPort: number;

    @ApiProperty({ type: BootnodeDto, required: false })    
    bootnode?: BootnodeDto;
    
    @ApiProperty({ type: AccountDto, required: false })
    minerAccount?: AccountDto;

    @ApiProperty()
    createdAt: Date;
}
