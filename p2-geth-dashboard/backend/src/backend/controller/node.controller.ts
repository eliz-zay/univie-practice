import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NodeService } from '../service';
import { CreateNodeRequest, NodeConfigDto, NodeDto, NodePeersDto, OkDto } from '../dto';

/**
 * Geth node API
 */
@ApiTags('Node')
@Controller('node')
export class NodeController {
    constructor(private readonly nodeService: NodeService) {}

    @ApiCreatedResponse({ type: OkDto })
    @Post()
    async createNode(@Body() body: CreateNodeRequest): Promise<OkDto> {
        await this.nodeService.createNode(body);
        return { ok: true };
    }

    @ApiOkResponse({ type: NodeConfigDto, isArray: true })
    @Get()
    getNodeList(): Promise<NodeConfigDto[]> {
        return this.nodeService.getNodeList();
    }

    @ApiOkResponse({ type: NodePeersDto, isArray: true })
    @Get('peer')
    getPeerNodes(): Promise<NodePeersDto[]> {
        return this.nodeService.getPeerNodes();
    }

    @ApiOkResponse({ type: NodeDto })
    @Get(':id')
    getNode(@Param('id') id: string): Promise<NodeDto> {
        return this.nodeService.getNode(id);
    }

    @ApiOkResponse({ type: OkDto })
    @Delete(':id')
    async deleteNode(@Param('id') id: string): Promise<OkDto> {
        await this.nodeService.deleteNode(id);
        return { ok: true };
    }
}
