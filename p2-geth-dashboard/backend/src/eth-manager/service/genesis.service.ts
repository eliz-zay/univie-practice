import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { CreateGenesisJsonDto, InitDataDirDto } from '../dto';
import { spawn } from 'child_process';

/**
 * genesis.json service: configure genesis.json, initialize node datadir
 */
@Injectable()
export class GenesisService {
    private readonly logger = new Logger(GenesisService.name);

    async createGenesisJson(dto: CreateGenesisJsonDto): Promise<void> {
        const signers: string[] = [];
        const alloc = {};
        dto.accounts.forEach((a) => {
            const address = a.address.split('0x')[1];
            alloc[address] = { balance: a.balance };
            if (a.isSigner) {
                signers.push(address);
            }
        });

        const extradata = '0x' + ''.padStart(64, '0') + signers.join('') + ''.padStart(130, '0');

        const content = {
            config: {
                chainId: Number(dto.networkId),
                homesteadBlock: 0,
                eip150Block: 0,
                eip155Block: 0,
                eip158Block: 0,
                byzantiumBlock: 0,
                constantinopleBlock: 0,
                petersburgBlock: 0,
                istanbulBlock: 0,
                berlinBlock: 0,
                londonBlock: 0,
                clique: {
                    period: dto.cliquePeriod,
                    epoch: 30000
                }
            },
            difficulty: 1,
            gasLimit: dto.gasLimit,
            extradata,
            alloc
        };

        await fs.promises.writeFile(dto.filePath, JSON.stringify(content, null, 2), 'utf-8');
    }

    async initDataDir(dto: InitDataDirDto): Promise<void> {
        try {
            const args = [
                'init',
                '--datadir', dto.dataDir,
                dto.genesisJsonPath
            ];

            const child = spawn('geth', args);

            if (!child.pid) {
                throw new InternalServerErrorException('Cannot spawn a child');
            }
                
            
            return new Promise((resolve, reject) => {
                child.on('close', (code: number) => {
                    this.logger.log(`[${child.pid}] exited with code ${code}`);
                    if (code === 0) {
                        resolve();
                    }
                    reject();
                });

                child.stdout.on('data', (chunk: Buffer) => {
                    const data = chunk.toString('utf-8');
                    if (data.includes('Fatal: ')) {
                        reject(data);
                    }
                });
    
                child.on('error', (error: Error) => {
                    this.logger.error(`[${child.pid}] error`, error);
                    reject(error);
                });
            });
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}
