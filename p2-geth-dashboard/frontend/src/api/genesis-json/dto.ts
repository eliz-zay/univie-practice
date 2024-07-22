import { AccountDto } from '../account/dto';

export interface DataDirDto {
    id: string;
    name: string;
    dir: string;
}

export interface PostGenesisJsonDto {
    name: string;
    networkId: string;
    cliquePeriod: number;
    gasLimit: string;
    accounts: {
        accountId: string;
        balance: string;
        isSigner: boolean;
    }[];
}

export interface GetGenesisJsonListDto {
    availableDirsOnly?: boolean;
}

export interface GenesisJsonListDto {
    id: string;
    name: string;
    networkId: string;
    filePath: string;
    dataDirs: {
        id: string;
        name: string;
        dir: string;
        node?: {
            id: string;
            name: string;
        };
    }[];
    accounts: {
        id: string;
        account: AccountDto;
        isSigner: boolean;
    }[];
}

export interface GenesisJsonDto {
    id: string;
    name: string;
    networkId: string;
    dataDirs: DataDirDto[];
    accounts: {
        id: string;
        account: AccountDto;
        isSigner: boolean;
    }[];
    filePath: string;
    content: string;
}

export interface PostDataDirDto {
    genesisId: string;
    name: string;
}

export interface IdDto {
    id: string;
}
