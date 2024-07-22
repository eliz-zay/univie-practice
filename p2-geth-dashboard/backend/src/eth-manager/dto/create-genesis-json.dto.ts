export interface CreateGenesisJsonDto {
    filePath: string;
    networkId: string;
    cliquePeriod: number;
    gasLimit: string;
    accounts: {
        address: string;
        balance: string;
        isSigner: boolean;
    }[];
}
