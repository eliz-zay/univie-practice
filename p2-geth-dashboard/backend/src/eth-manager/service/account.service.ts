import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { AccountDto, CreateAccountDto} from '../dto';
import { EthereumConfig } from 'config/config';

/**
 * Geth account service: initialize an account using shell command
 */
@Injectable()
export class AccountService {
    private readonly logger = new Logger(AccountService.name);

    private readonly tmpDir: string;
    private readonly accountsDataDir: string;

    constructor(configService: ConfigService) {
        const config = configService.getOrThrow<EthereumConfig>('ethereum');
        this.tmpDir = config.tmpFilesDir;
        this.accountsDataDir = config.accountsDataDir;
    }

    async createAccount(dto: CreateAccountDto): Promise<AccountDto> {
        try {
            await fs.promises.mkdir(this.tmpDir, { recursive: true });
            const passwordFile = path.join(this.tmpDir, uuidv4() + '.txt');
            fs.writeFileSync(passwordFile, dto.password, 'utf-8');

            const args = [
                'account', 'new',
                '--datadir', this.accountsDataDir,
                '--password', passwordFile
            ];

            const child = spawn('geth', args);

            if (!child.pid) {
                throw new InternalServerErrorException('Cannot spawn a child');
            }
                
            child.on('close', (code: number) => {
                this.logger.log(`[${child.pid}] exited with code ${code}`);
            });

            return new Promise((resolve, reject) => {
                child.stdout.on('data', (chunk: Buffer) => {
                    const data = chunk.toString('utf-8');
                    const address = data
                        .split('Public address of the key:   ')[1]
                        .split('\n')[0];
                    const secretKeyPath = data
                        .split('Path of the secret key file: ')[1]
                        .split('\n')[0];

                    this.logger.log(`[${child.pid}] [stdout]: ${data}`);

                    resolve({ address, secretKeyPath });
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
