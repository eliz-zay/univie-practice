import * as solc from 'solc';
import * as fs from 'fs';
import { Contract } from 'web3';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

interface CompiledContract {
    abi: any;
    bytecode: string;
}

@Injectable()
export class SmartContractService {
    private compiledContracts: Contract<any>[];

    private readonly source: string;

    constructor(configService: ConfigService) {
        this.source = configService.getOrThrow('ETH_CONTRACT_PATH');
    }

    async compileContracts() {
        this.compiledContracts = await this.getCompiledContracts(this.source);
    }

    getContract(name: string): CompiledContract {
        const contract = this.compiledContracts[name];

        const abi = contract.abi;
        const bytecode = '0x' + contract.evm.bytecode.object;

        return { abi, bytecode };
    }

    private async getCompiledContracts(sourcePath: string): Promise<any> {
        const fileName = String(sourcePath.split('/').at(-1));
        const sourcePayload = fs.readFileSync(sourcePath, 'utf8');

        const source = {
            language: 'Solidity',
            sources: { [fileName]: { content: sourcePayload } },
            settings: { outputSelection: { '*': { '*': ['*'] } }, evmVersion: 'berlin' },
        };

        const compilationOutput = JSON.parse(solc.compile(JSON.stringify(source)));
        const compiledContracts = compilationOutput.contracts[fileName];

        return compiledContracts;
    }
}
