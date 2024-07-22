import { BadRequestException, Injectable } from '@nestjs/common';

import { AddSignatureDto } from 'src/dto';
import { DocumentService, MonitoringContractService, UserService } from '.';

@Injectable()
export class SignatureService {
    constructor(
        private readonly userService: UserService,
        private readonly documentService: DocumentService,
        private readonly monitoringContractService: MonitoringContractService,
    ) {}

    async addSignature(dto: AddSignatureDto): Promise<void> {
        const [document] = await Promise.all([
            this.documentService.getDocument(dto.documentId),
            this.userService.validateUser(dto.userId)
        ]);

        if (document.contractAddress) {
            throw new BadRequestException('Document is already processed');
        }
        
        await this.monitoringContractService.addSignature(dto.documentId, dto.userId, dto.vote);
    }
}
