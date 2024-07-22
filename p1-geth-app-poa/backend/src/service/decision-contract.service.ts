import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { EthereumService } from './ethereum.service';
import { SmartContractService } from './smart-contract.service';
import { ConfigService } from '@nestjs/config';

interface Signature {
    signerId: string;
    vote: boolean;
    '0': string;
    '1': string;
    __length__: number;
}

interface ContractPayload {
    signatures: { signerId: string; vote: boolean; }[];
    id: string;
    hash: string;
}

@Injectable()
export class DecisionContractService {
    private readonly abi: any;

    private readonly isDevMode: boolean;

    constructor(
        private readonly ethereumService: EthereumService,
        private readonly smartContractService: SmartContractService,
        configService: ConfigService
    ) {
        const { abi } = this.smartContractService.getContract('DecisionContract');
        this.abi = abi;
        this.isDevMode = configService.get('DEV_MODE') ?? false;
    }

    async callContract(address: string): Promise<ContractPayload> {
        if (this.isDevMode) {
            return {
                signatures: [
                    { signerId: '657ef537aaa83535e7dbefbc', vote: true },
                    { signerId: '65808fde2438e88bf4a8d3ca', vote: false }
                ],
                id: '123',
                hash: '123'
            };
        }

        const web3 = this.ethereumService.getWeb3();

        try {
            const contract = new web3.eth.Contract(this.abi, address);

            const signatures = await contract.methods.getSignatures().call() as Signature[];
            const id = await contract.methods.getId().call() as string;
            const hash = await contract.methods.getHash().call() as string;
            
            return {
                signatures: signatures.map((s) => ({ signerId: s.signerId, vote: s.vote })),
                id,
                hash
            };
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}
