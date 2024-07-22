import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Matches } from 'class-validator';
import { objectIdRegex } from './regex/object-id';

export class AddSignatureDto {
    @ApiProperty()
    @IsString()
    @Matches(objectIdRegex)
    documentId: string;

    @ApiProperty()
    @IsString()
    @Matches(objectIdRegex)
    userId: string;

    @ApiProperty()
    @IsBoolean()
    vote: boolean;
}
