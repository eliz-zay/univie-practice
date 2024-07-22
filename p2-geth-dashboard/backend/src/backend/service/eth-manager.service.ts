import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateNodeRequest, EthInfoDto, SpawnDto } from '../dto';
import { MonitoringService, SpawnerService } from '../../eth-manager/service';
import { PidDto } from '../dto/eth-manager/pid.dto';
import { EthereumConfig } from 'config/config';
import { Account, DataDir, EProtocol, Node } from '../model';

/**
 * EthManagerModule wrapper
 */
@Injectable()
export class EthManagerService {
    private readonly ethNodesHost: string;

    constructor(
        private readonly monitoringService: MonitoringService,
        private readonly spawnService: SpawnerService,
        configService: ConfigService
    ) {
        this.ethNodesHost = configService.getOrThrow<EthereumConfig>('ethereum').nodesHost;
    }

    async checkConnection(node: Node): Promise<boolean> {
        const endpoint = node.endpoints.find((e) => e.protocol === EProtocol.Http)!;

        return await this.monitoringService.checkConnection({
            port: endpoint.port, host: this.ethNodesHost
        });
    }

    async get(node: Node): Promise<EthInfoDto> {
        const endpoint = node.endpoints.find((e) => e.protocol === EProtocol.Http)!;

        return await this.monitoringService.getNode({
            port: endpoint.port, host: this.ethNodesHost
        });
    }

    async spawn(
        dto: CreateNodeRequest,
        { bootnode, minerAccount, logFile, dataDir }: { bootnode?: Node; minerAccount?: Account; logFile: string; dataDir: DataDir; }
    ): Promise<PidDto> {
        const param: SpawnDto = {
            endpoints: dto.endpoints,
            dataDir: dataDir.dir,
            port: dto.port,
            authRpcPort: dto.authRpcPort,
            minerAccount,
            logFile
        };

        if (bootnode) {
            param.bootnode = {
                port: bootnode.endpoints.find((e) => e.protocol === EProtocol.Http)!.port,
                host: this.ethNodesHost
            };
        }

        const processInfo = await this.spawnService.spawnNode(param);

        return processInfo;
    }

    async kill(pid: number): Promise<void> {
        await this.spawnService.kill(pid);
    }
}
