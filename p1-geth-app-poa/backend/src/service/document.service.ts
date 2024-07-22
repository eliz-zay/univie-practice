import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

import { IDocument, documentModel } from '../model';
import { DocumentDto, DocumentSummaryDto } from '../dto';
import { MonitoringContractService } from './monitoring-contract.service';
import { DecisionContractService } from './decision-contract.service';
import { UserService } from './user.service';

@Injectable()
export class DocumentService {
    constructor(
        private readonly monitoringContractService: MonitoringContractService,
        private readonly decisionContractService: DecisionContractService,
        private readonly userService: UserService,
    ) {}

    async addDocument(file: Express.Multer.File): Promise<void> {
        if (!file.buffer.length) {
            throw new BadRequestException('File cannot be empty');
        }

        const document: Partial<IDocument> = {
            title: file.originalname,
            binaryContent: file.buffer,
            createdAt: new Date(),
        };

        const { _id } = await documentModel.create(document);
        const hash = this.generateHash(file.buffer);

        await this.monitoringContractService.addDocument(String(_id), hash);
    }

    async getDocuments(): Promise<DocumentSummaryDto[]> {
        const documents = await documentModel
            .find()
            .select({ id: true, title: true, createdAt: true, contractAddress: true })
            .sort({ createdAt: 'desc' });

        return documents;
    }

    async getDocumentWithSignatures(id: string): Promise<DocumentDto> {
        const document = await documentModel.findById(id).select({
            id: true, title: true, createdAt: true, contractAddress: true, binaryContent: true
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        const dto: DocumentDto = {
            id: String(document._id),
            title: document.title,
            createdAt: document.createdAt,
            contractAddress: document?.contractAddress,
        };
        
        if (document.contractAddress) {
            const contract = await this.decisionContractService.callContract(document.contractAddress);

            const users = await this.userService.getUsers();
            const positiveVoteCount = contract.signatures.filter((s) => s.vote).length;

            dto.isHashValid = contract.hash === this.generateHash(document.binaryContent);
            dto.isApproved = positiveVoteCount > contract.signatures.length / 2;
            dto.signatures = contract.signatures.map((s) => ({
                vote: s.vote,
                signer: users.find((u) => u.id === s.signerId)!
            }));
        }

        return dto;
    }

    async getDocument(id: string): Promise<IDocument> {
        const document = await documentModel.findById(id);

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        return document;
    }

    async deleteDocument(id: string): Promise<void> {
        await documentModel.deleteOne({ _id: id });
    }

    private generateHash(buffer: Buffer): string {
        const hashObject = crypto.createHash('sha256');
        hashObject.update(buffer);

        return hashObject.digest('hex');
    }
}
