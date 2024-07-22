import { ApiProperty } from '@nestjs/swagger';
import { EProtocol } from '../../model';

export class NodeEndpointDto {
    @ApiProperty()
    port: number;

    @ApiProperty({ enum: EProtocol })
    protocol: EProtocol;
}
