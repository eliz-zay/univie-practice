import { ApiProperty } from '@nestjs/swagger';
import { PeersDto } from './node.dto';

class NodePeersNodeItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    ethId: string;

    @ApiProperty({ type: PeersDto, isArray: true })
    peers: PeersDto[];
}

export class NodePeersDto {
    @ApiProperty()
    networkId: string;

    @ApiProperty()
    genesisName: string;

    @ApiProperty({ type: NodePeersNodeItemDto, isArray: true })
    nodes: NodePeersNodeItemDto[];
}
