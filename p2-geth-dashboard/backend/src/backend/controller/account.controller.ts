import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from '../service';
import { AccountDto, CreateAccountRequest, NodeDto, OkDto } from '../dto';

/**
 * Geth account API
 */
@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @ApiCreatedResponse({ type: OkDto })
    @Post()
    async createAccount(@Body() body: CreateAccountRequest): Promise<OkDto> {
        await this.accountService.createAccount(body);
        return { ok: true };
    }

    @ApiOkResponse({ type: AccountDto, isArray: true })
    @Get()
    getAccountList(): Promise<AccountDto[]> {
        return this.accountService.getAccountList();
    }

    @ApiOkResponse({ type: NodeDto })
    @Delete(':id')
    async deleteAccount(@Param('id') id: string): Promise<OkDto> {
        await this.accountService.deleteAccount(id);
        return { ok: true };
    }
}
