import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class DocumentSummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ required: false })
    contractAddress?: string;
}

export class SignatureDto {
    @ApiProperty({ type: UserDto })
    signer: UserDto;

    @ApiProperty()
    vote: boolean;
}

export class DocumentDto extends DocumentSummaryDto {
    @ApiProperty({ type: SignatureDto, isArray: true })
    signatures?: SignatureDto[];

    @ApiProperty({ required: false })
    isHashValid?: boolean;

    @ApiProperty({ required: false })
    isApproved?: boolean;
}

export class AddDocumentDto {
    @ApiProperty({ type: String, format: 'binary' })
    file: Express.Multer.File;
}
