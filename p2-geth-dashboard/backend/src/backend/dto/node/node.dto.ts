import { ApiProperty } from '@nestjs/swagger';

import { NodeConfigDto } from '..';

export class PeersDto {
    @ApiProperty({ description: 'ID of node in Ethereum API' })
    id: string;
}

class NodeInfoPorts {
    @ApiProperty()
    discovery: number;

    @ApiProperty()
    listener: number;
}

export class NodeInfoDto {
    @ApiProperty()
    enr: string; // enr:...

    @ApiProperty()
    id: string;

    @ApiProperty()
    ip: string; // e.g. 127.0.0.1

    @ApiProperty({ type: NodeInfoPorts })
    ports: NodeInfoPorts;
}

export class LogsDto {
    @ApiProperty({ required: false })
    stringLog?: string;

    @ApiProperty({ required: false })
    address?: string;

    @ApiProperty({ required: false, isArray: true })
    topics?: string[];

    @ApiProperty({ required: false })
    data?: string;

    @ApiProperty({ required: false })
    blockNumber?: number;

    @ApiProperty({ required: false })
    transactionHash?: string;

    @ApiProperty({ required: false })
    transactionIndex?: number;

    @ApiProperty({ required: false })
    blockHash?: string;

    @ApiProperty({ required: false })
    logIndex?: number;

    @ApiProperty({ required: false })
    removed?: boolean;
}

export class EthInfoDto {
    @ApiProperty()
    networkId: string;

    @ApiProperty()
    isMining: boolean;

    @ApiProperty({ type: PeersDto, isArray: true })
    peers: PeersDto[];

    @ApiProperty({ type: NodeInfoDto })
    node: NodeInfoDto;

    @ApiProperty({ type: LogsDto, isArray: true })
    transactionLogs: LogsDto[];
}

export class NodeDto extends NodeConfigDto {
    @ApiProperty({ type: EthInfoDto, required: false })
    ethInfo?: EthInfoDto;

    @ApiProperty()
    logs: string;
}
