import { UserDto } from '../user/dto';

export interface DocumentTableDto {
    id: string;
    title: string;
    createdAt: Date;
    contractAddress?: string;
}

interface SignatureDto {
    signer: UserDto;
    vote: boolean;
}

export interface DocumentDto {
    id: string;
    title: string;
    createdAt: Date;
    contractAddress?: string;
    signatures?: SignatureDto[];
    isHashValid?: boolean;
    isApproved?: boolean;
}
