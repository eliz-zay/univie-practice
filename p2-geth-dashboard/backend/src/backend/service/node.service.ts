import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Account, DataDir, EProtocol, Node } from '../model';
import { CreateNodeRequest, NodeConfigDto, NodeDto, NodePeersDto } from '../dto';
import { AccountService, EthManagerService, GenesisService } from '.';
import { EthereumConfig } from 'config/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Creates, gets, deleted and kills nodes
 */
@Injectable()
export class NodeService {
    private readonly logger = new Logger(NodeService.name);

    private readonly logsDir: string;

    constructor(
        private readonly ethManagerService: EthManagerService,
        private readonly accountService: AccountService,
        private readonly genesisService: GenesisService,
        @InjectRepository(Node)
        private readonly nodeRepository: Repository<Node>,
        configService: ConfigService
    ) {
        this.logsDir = configService.getOrThrow<EthereumConfig>('ethereum').logsDir;
    }

    async createNode(dto: CreateNodeRequest): Promise<void> {
        if (!dto.endpoints.find((e) => e.protocol === EProtocol.Http)) {
            throw new BadRequestException('Node must have an http endpoint');
        }

        const { bootnode, minerAccount, dataDir } = await this.validateCreateNode(dto);

        const id = uuidv4();
        await fs.promises.mkdir(this.logsDir, { recursive: true });
        const logFile = path.join(this.logsDir, id + '.log')
        const { pid } = await this.ethManagerService.spawn(
            dto, { bootnode, minerAccount, logFile, dataDir }
        );
        
        await this.nodeRepository.save(new Node({
            id,
            pid,
            logFile,
            name: dto.name,
            endpoints: dto.endpoints,
            dataDir,
            port: dto.port,
            authRpcPort: dto.authRpcPort,
            bootnode,
            minerAccount,
        }));

        this.logger.log(`Spawned: id ${id}, pid ${pid}`);
    }

    async getNodeList(): Promise<NodeConfigDto[]> {
        const nodes = await this.nodeRepository.find({
            relations: {
                bootnode: true,
                minerAccount: true,
                dataDir: {
                    genesis: true
                }
            },
            order: {
                createdAt: 'DESC'
            }
        });

        const nodeStatuses = await Promise.all(
            nodes.map((node) => this.ethManagerService.checkConnection(node))
        );

        return nodes.map((node, i) => ({
            id: String(node.id),
            isRunning: nodeStatuses[i],
            pid: node.pid,
            name: node.name,
            endpoints: node.endpoints,
            dataDir: node.dataDir,
            port: node.port,
            authRpcPort: node.authRpcPort,
            bootnode: node.bootnode,
            minerAccount: node.minerAccount,
            createdAt: node.createdAt
        }));
    }

    async getPeerNodes(): Promise<NodePeersDto[]> {
        const nodes = await this.nodeRepository.find({
            relations: {
                dataDir: {
                    genesis: true
                }
            }
        });

        const ethInfo = await Promise.allSettled(
            nodes.map((n) => this.ethManagerService.get(n))
        );

        const result: NodePeersDto[] = [];
        ethInfo.forEach((r, i) => {
            if (r.status === 'fulfilled') {
                const node = nodes[i];
                const item = result.find((item) => item.networkId === node.dataDir.genesis.networkId);
                const nodeDto = {
                    id: node.id,
                    name: node.name,
                    ethId: r.value.node.id,
                    peers: r.value.peers
                };
                if (item) {
                    item.nodes.push(nodeDto);
                } else {
                    result.push({
                        networkId: node.dataDir.genesis.networkId,
                        genesisName: node.dataDir.genesis.name,
                        nodes: [nodeDto]
                    });
                }
            }
        });

        return result;
    }
    
    async getNode(id: string): Promise<NodeDto> {
        const node = await this.nodeRepository.findOne({
            where: { id },
            relations: {
                bootnode: true,
                minerAccount: true,
                dataDir: {
                    genesis: true
                },
            }
        });
        if (!node) {
            throw new NotFoundException('Node not found');
        }

        const logsBuffer = await fs.promises.readFile(node.logFile);
        const logs = logsBuffer.toString();

        const isRunning = await this.ethManagerService.checkConnection(node);

        const dto: NodeDto = {
            id: String(node.id),
            isRunning,
            pid: node.pid,
            logs,
            name: node.name,
            endpoints: node.endpoints,
            dataDir: node.dataDir,
            port: node.port,
            authRpcPort: node.authRpcPort,
            bootnode: node.bootnode,
            minerAccount: node.minerAccount,
            createdAt: node.createdAt
        };

        if (isRunning) {
            dto.ethInfo = await this.ethManagerService.get(node);
        }
        
        return dto;
    }

    async deleteNode(id: string): Promise<void> {
        const node = await this.nodeRepository.findOne({ where: { id } });
        if (!node) {
            throw new NotFoundException('Node not found');
        }

        await this.ethManagerService.kill(node.pid);
        await this.nodeRepository.delete({ id });

        this.logger.log(`Killed: id ${id}, pid ${node.pid}`);
    }

    private async validateCreateNode(dto: CreateNodeRequest): Promise<{
        bootnode?: Node; minerAccount?: Account; dataDir: DataDir;
    }> {
        const nodes = await this.nodeRepository.find({
            relations: {
                dataDir: true
            }
        });

        // Validate ports: check if already taken
        const portsInUse = nodes.flatMap(
            (n) => [...n.endpoints.map((e) => e.port), n.port, n.authRpcPort]
        );
        const ports = [...dto.endpoints.map((e) => e.port), dto.port, dto.authRpcPort];
        if (ports.find((p) => portsInUse.includes(p))) {
            throw new BadRequestException('Port is already in use');
        }

        // Validate datadir
        const dataDir = await this.genesisService.getDataDir(dto.dataDirId);
        if (nodes.find((n) => n.dataDir.id === dto.dataDirId)) {
            throw new BadRequestException('Datadir is already taken');
        }

        // Validate bootnode (if provided)
        let bootnode: Node | undefined;
        if (dto.bootnodeId) {
            const node = await this.nodeRepository.findOne({ where: { id: dto.bootnodeId } });
            if (!node) {
                throw new NotFoundException('Bootode not found');
            }
            bootnode = node;
        }

        // Validate miner account (if provided)
        const minerAccount = dto.minerAccountId
            ? await this.accountService.getAccount(dto.minerAccountId)
            : undefined;

        return { bootnode, minerAccount, dataDir };
    }
}
