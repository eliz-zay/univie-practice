import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Contract } from 'web3';

import { EthereumService } from './ethereum.service';
import { SmartContractService } from './smart-contract.service';

@Injectable()
export class MonitoringContractService {
    private contract: Contract<any>;
    private readonly address: string;
    private bytecode: string;

    private readonly isDevMode: boolean;

    constructor(
        private readonly ethereumService: EthereumService,
        private readonly smartContractService: SmartContractService,
        configService: ConfigService
    ) {
        this.address = configService.getOrThrow('ETH_MONITORING_CONTRACT_ADDRESS');
        this.isDevMode = configService.get('DEV_MODE') ?? false;
    }

    async addDocument(id: string, hash: string): Promise<void> {
        if (this.isDevMode) {
            return;
        }

        try {
            await (this.contract.methods.addDocument as any)(id, hash).send();
        } catch (error) {
            this.parseError(error);
        }
    }

    async addSignature(id: string, signerId: string, vote: boolean): Promise<void> {
        if (this.isDevMode) {
            return;
        }

        try {
            await (this.contract.methods.addSignature as any)(id, signerId, vote).send();
        } catch (error) {
            this.parseError(error);
        }
    }

    async connectToContract(): Promise<void> {
        if (this.isDevMode) {
            return;
        }

        const { abi, bytecode } = this.smartContractService.getContract('MonitoringContract');
        const web3 = this.ethereumService.getWeb3();
        const account = this.ethereumService.getAccount();

        this.bytecode = bytecode;
        this.contract = new web3.eth.Contract(
            abi,
            this.address,
            { from: account }
        );
    }

    async compileContract(): Promise<void> {
        if (this.isDevMode) {
            return;
        }

        const { abi, bytecode } = this.smartContractService.getContract('MonitoringContract');
        const web3 = this.ethereumService.getWeb3();

        this.bytecode = bytecode;
        this.contract = new web3.eth.Contract(abi);
    }

    getContract(): Contract<any> {
        return this.contract;
    }

    getBytecode(): string {
        return this.bytecode;
    }

    private parseError(error: any): void {
        if (error.name === 'ContractExecutionError') {
            throw new BadRequestException(String(error.innerError));
        } else {
            Logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}
