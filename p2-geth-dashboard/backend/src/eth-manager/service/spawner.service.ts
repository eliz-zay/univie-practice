import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { exec, spawn } from 'child_process';
import { kill } from 'process';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { RpcService } from '.';
import { EProtocol, PidDto, SpawnDto } from '../dto';
import { EthereumConfig } from 'config/config';

/**
 * Configure and spawn nodes as detached processes;
 * kill processes by PIDs
 */
@Injectable()
export class SpawnerService {
    private readonly logger = new Logger(SpawnerService.name);

    private readonly tmpDir: string;

    constructor(
        private readonly rpcService: RpcService,
        configService: ConfigService
    ) {
        const config = configService.getOrThrow<EthereumConfig>('ethereum');
        this.tmpDir = config.tmpFilesDir;
    }

    async spawnNode(dto: SpawnDto): Promise<PidDto> {
        try {
            const out = fs.openSync(dto.logFile, 'a');

            const args = await this.generateGethArgs(dto);
            const child = spawn('geth', args, { detached: true, stdio: [ 'ignore', out, out] });
            child.unref();

            fs.closeSync(out);

            if (!child.pid) {
                throw new InternalServerErrorException('Cannot spawn a child');
            }

            this.logger.log(`[${child.pid}] spawned: 'geth ${args.join(' ')}'`);

            return { pid: child.pid };
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    async kill(pid: number): Promise<void> {
        try {
            kill(pid, 'SIGHUP');

            // Verify that process is killed
            return new Promise((resolve, reject) => {
                setTimeout(
                    () => exec(
                        `ps -p ${pid}`,
                        (error) => error?.code === 1
                            ? resolve()
                            : reject(new BadRequestException('Process kill failed'))
                    ),
                    3000
                );
            });
        } catch (error) {
            if (error.code === 'ESRCH') {
                this.logger.warn(`Kill failed: [${pid}] process does not exist`);
            } else {
                throw error;
            }
        }
    }

    private async generateGethArgs(dto: SpawnDto): Promise<string[]> {
        const args = [
            '--datadir', dto.dataDir,
            '--nat', 'extip:127.0.0.1',
            '--port', dto.port.toString(),
            '--authrpc.port', dto.authRpcPort.toString(),
        ];

        for (const e of dto.endpoints) {
            if (e.protocol === EProtocol.Http) {
                args.push(
                    '--http', '--http.api', 'eth,net,web3,personal,admin,debug,clique',
                    '--http.port', e.port.toString()
                );
            } else {
                args.push(
                    '--ws', '--ws.api', 'eth,net,web3,personal',
                    '--ws.port', e.port.toString()
                );
            }
        }
        if (dto.minerAccount) {
            await fs.promises.mkdir(this.tmpDir, { recursive: true });
            const passwordFile = path.join(this.tmpDir, uuidv4() + '.txt');
            fs.writeFileSync(passwordFile, dto.minerAccount.password, 'utf-8');

            args.push(
                '--keystore', path.dirname(dto.minerAccount.secretKeyPath),
                '--allow-insecure-unlock',
                '--unlock', dto.minerAccount.address,
                '--mine', '--miner.etherbase', dto.minerAccount.address,
                '--password', passwordFile
            );
        }
        if (dto.bootnode) {
            const { enr } = await this.rpcService.getNodeInfo(`http://${dto.bootnode.host}:${dto.bootnode.port}`);
            args.push('--bootnodes', enr);
        }

        return args;
    }
}
