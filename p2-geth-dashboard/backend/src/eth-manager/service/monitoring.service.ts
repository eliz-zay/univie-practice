import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BlockTags, FMT_BYTES, FMT_NUMBER, HttpProvider, Web3 } from 'web3';
import { RegisteredSubscription } from 'web3/lib/commonjs/eth.exports';

import { RpcService } from '.';
import { GetNodeDto, LogsDto, NodeDto } from '../dto';

/**
 * Retrieve node state by HTTP endpoint
 */
@Injectable()
export class MonitoringService {
    private readonly logger = new Logger(MonitoringService.name);

    private readonly connectionTimeout = 1000;
    private readonly ethNumberType = { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX };

    constructor(private readonly rpcService: RpcService) {}

    async checkConnection(dto: GetNodeDto): Promise<boolean> {
        try {
            const url = `http://${dto.host}:${dto.port}`;
            await this.connectToNode(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    async getNode(dto: GetNodeDto): Promise<NodeDto> {
        const url = `http://${dto.host}:${dto.port}`;
        
        const web3 = await this.connectToNode(url);

        const [networkId, isMining, node, peers, transactionLogs] = await Promise.all([
            web3.eth.net.getId(this.ethNumberType),
            web3.eth.isMining(),
            this.rpcService.getNodeInfo(url),
            this.rpcService.getPeers(url),
            this.getLogs(web3),
        ]);

        return { networkId: String(networkId), isMining, node, peers, transactionLogs };
    }

    private async getLogs(web3: Web3<RegisteredSubscription>): Promise<LogsDto[]> {
        const logs = await web3.eth.getPastLogs({ fromBlock: BlockTags.EARLIEST });

        return logs.map((log) => {
            let dto: LogsDto = {};
            if (typeof log === 'string') {
                dto.stringLog = log;
            } else {
                dto = {
                    address: log.address,
                    topics: log.topics,
                    data: log.data,
                    blockNumber: Number(log.blockNumber),
                    transactionHash: log.transactionHash,
                    transactionIndex: Number(log.transactionIndex),
                    blockHash: log.blockHash,
                    logIndex: Number(log.logIndex),
                    removed: log.removed,
                };
            }

            return dto;
        });
    }

    private async connectToNode(url: string): Promise<Web3<RegisteredSubscription>> {
        try {
            const web3 = new Web3(new HttpProvider(url));

            const isConnected = await Promise.race([
                web3.eth.net.isListening(),
                new Promise((resolve, reject) => {
                    setTimeout(() => reject('Timeout'), this.connectionTimeout)
                })
            ]);

            if (!isConnected) {
                throw new BadRequestException();
            }

            return web3;
        } catch (error) {
            this.logger.warn(`Connection error: ${url}`);
            throw new BadRequestException('Node connection failed');
        }
    }
}
