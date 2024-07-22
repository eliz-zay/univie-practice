import { Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiConsumes, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { DocumentService } from '../service';
import { AddDocumentDto, DocumentDto, DocumentSummaryDto, OkDto } from '../dto';
import { validateObjectId } from 'src/dto/regex/object-id';

@ApiTags('Document')
@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @ApiOkResponse({ type: DocumentSummaryDto, isArray: true })
    @Get()
    async getDocuments(): Promise<DocumentSummaryDto[]> {
        return this.documentService.getDocuments();
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: AddDocumentDto })
    @ApiCreatedResponse({ type: OkDto })
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async addDocument(@UploadedFile() file: Express.Multer.File): Promise<OkDto> {
        await this.documentService.addDocument(file);
        return { ok: true };
    }

    @ApiOkResponse({ type: DocumentDto })
    @Get(':id')
    async getDocument(@Param('id') id: string): Promise<DocumentDto> {
        validateObjectId(id);

        return this.documentService.getDocumentWithSignatures(id);
    }

    @Get(':id/download')
    async downloadDocument(@Param('id') id: string, @Res() response: Response): Promise<void> {
        validateObjectId(id);

        const document = await this.documentService.getDocument(id);

        response.set('Content-Type', 'application/octet-stream');
        response.set('Content-Disposition', `attachment; filename=${document.title}`);
        response.set('Content-Length', String(document.binaryContent.length));
        response.send(document.binaryContent);
    }

    @Delete(':id')
    async deleteDocument(@Param('id') id: string): Promise<OkDto> {
        validateObjectId(id);

        await this.documentService.deleteDocument(id);
        return { ok: true };
    }
}
