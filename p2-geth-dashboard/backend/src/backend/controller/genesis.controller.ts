import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GenesisService } from '../service';
import { CreateGenesisJsonDto, GenesisJsonDto, GenesisJsonListDto, GetGenesisJsonListDto, IdDto, InitDataDirDto, OkDto } from '../dto';

/**
 * genesis.json API
 */
@ApiTags('genesis.json')
@Controller('genesis')
export class GenesisController {
    constructor(private readonly genesisService: GenesisService) {}

    @ApiCreatedResponse({ type: IdDto })
    @Post()
    async createGenesisJson(@Body() body: CreateGenesisJsonDto): Promise<IdDto> {
        return this.genesisService.createGenesisJson(body);
    }

    @ApiOkResponse({ type: GenesisJsonListDto, isArray: true })
    @Get()
    getGenesisJsonList(@Query() query: GetGenesisJsonListDto): Promise<GenesisJsonListDto[]> {
        return this.genesisService.getGenesisJsonList(query);
    }

    @ApiOkResponse({ type: GenesisJsonDto })
    @Get(':id')
    getGenesisJson(@Param('id') id: string): Promise<GenesisJsonDto> {
        return this.genesisService.getGenesisJson(id);
    }

    @ApiCreatedResponse({ type: OkDto })
    @Post('data-dir')
    async initDataDir(@Body() body: InitDataDirDto): Promise<OkDto> {
        await this.genesisService.initDataDir(body);
        return { ok: true };
    }

    @ApiOkResponse({ type: OkDto })
    @Delete('data-dir/:dirId')
    async deleteDataDir(@Param('dirId') dirId: string): Promise<OkDto> {
        await this.genesisService.deleteDataDir(dirId);
        return { ok: true };
    }

    @ApiOkResponse({ type: OkDto })
    @Delete(':id')
    async deleteGenesisJson(@Param('id') id: string): Promise<OkDto> {
        await this.genesisService.deleteGenesisJson(id);
        return { ok: true };
    }
}
