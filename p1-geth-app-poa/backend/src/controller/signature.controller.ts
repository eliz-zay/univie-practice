import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { AddSignatureDto, OkDto } from '../dto';
import { SignatureService } from '../service';

@ApiTags('Signature')
@Controller('signature')
export class SignatureController {
    constructor(private readonly signatureService: SignatureService) {}

    @ApiCreatedResponse({ type: OkDto })
    @Post()
    async addSignature(@Body() body: AddSignatureDto): Promise<OkDto> {
        await this.signatureService.addSignature(body);
        return { ok: true };
    }
}
