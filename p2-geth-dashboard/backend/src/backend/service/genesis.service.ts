import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { EthereumConfig } from 'config/config';
import { CreateGenesisJsonDto, GenesisJsonDto, GenesisJsonListDto, GetGenesisJsonListDto, IdDto, InitDataDirDto } from '../dto';
import { GenesisService as GenesisEthService } from '../../eth-manager/service';
import { AccountService } from '.';
import { InjectRepository } from '@nestjs/typeorm';
import { DataDir, Genesis, GenesisAccount } from '../model';
import { Repository } from 'typeorm';

/**
 * Creates and gets genesis.json files;
 * initializes and deletes node data directories
 */
@Injectable()
export class GenesisService {
    private readonly genesisDir: string;

    constructor(
        private readonly genesisEthService: GenesisEthService,
        private readonly accountService: AccountService,
        @InjectRepository(Genesis)
        private readonly genesisRepository: Repository<Genesis>,
        @InjectRepository(GenesisAccount)
        private readonly genesisAccountRepository: Repository<GenesisAccount>,
        @InjectRepository(DataDir)
        private readonly dataDirRepository: Repository<DataDir>,
        configService: ConfigService
    ) {
        this.genesisDir = configService.getOrThrow<EthereumConfig>('ethereum').genesisDir;
    }

    async createGenesisJson(dto: CreateGenesisJsonDto): Promise<IdDto> {
        if (!dto.accounts.find((a) => a.isSigner)) {
            throw new BadRequestException('Genesis JSON must have at least 1 signer account');
        }

        const id = uuidv4();

        await fs.promises.mkdir(this.genesisDir, { recursive: true });
        const filePath = path.join(this.genesisDir, id + '.json');

        const accounts = await this.accountService.getAccountList(
            dto.accounts.map((a) => a.accountId)
        );

        const dtoAccounts: { address: string; balance: string; isSigner: boolean; }[] = [];
        const genesisAccounts: { account: string; isSigner: boolean; }[] = [];

        dto.accounts.forEach(({ accountId, balance, isSigner }) => {
            const account = accounts.find((a) => a.id === accountId)!;
            dtoAccounts.push({ address: account.address, balance, isSigner });
            genesisAccounts.push({ account: account.id, isSigner });
        });

        await this.genesisEthService.createGenesisJson({
            filePath,
            networkId: dto.networkId,
            cliquePeriod: dto.cliquePeriod,
            gasLimit: dto.gasLimit,
            accounts: dtoAccounts,
        });

        const genesis = await this.genesisRepository.save(new Genesis({
            id,
            name: dto.name,
            networkId: dto.networkId,
            filePath,
        }));

        await this.genesisAccountRepository.save(
            genesisAccounts.map((a) => new GenesisAccount({
                isSigner: a.isSigner,
                accountId: a.account,
                genesis
            }))
        );

        return { id };
    }

    async getGenesisJsonList(dto: GetGenesisJsonListDto): Promise<GenesisJsonListDto[]> {
        const genesis = await this.genesisRepository.find({
            relations: {
                dataDirs: {
                    node: true,
                },
                genesisAccounts: { account: true }
            },
            select: {
                id: true, name: true, networkId: true, filePath: true,
                dataDirs: {
                    id: true,
                    name: true,
                    dir: true,
                    node: { id: true, name: true }
                },
                genesisAccounts: {
                    id: true,
                    isSigner: true,
                    account: { id: true, name: true, address: true }
                }
            }
        });

        const unavailableDirs = await this.dataDirRepository
            .createQueryBuilder('d')
            .innerJoinAndSelect('d.node', 'node')
            .getMany();

        return genesis.map((g) => ({
            id: g.id,
            name: g.name,
            networkId: g.networkId,
            filePath: g.filePath,
            dataDirs: dto.availableDirsOnly
                ? g.dataDirs.filter((dir) => !unavailableDirs.find((d) => d.id === dir.id))
                : g.dataDirs,
            accounts: g.genesisAccounts
        }));
    }

    async getGenesisJson(id: string): Promise<GenesisJsonDto> {
        const genesis = await this.genesisRepository.findOne({
            where: { id },
            relations: {
                dataDirs: true,
                genesisAccounts: { account: true }
            }
        });
        if (!genesis) {
            throw new NotFoundException();
        }

        const contentBuffer = await fs.promises.readFile(genesis.filePath);
        const content = contentBuffer.toString();

        return {
            id,
            name: genesis.name,
            networkId: genesis.networkId,
            dataDirs: genesis.dataDirs,
            accounts: genesis.genesisAccounts,
            filePath: genesis.filePath,
            content
        };
    }

    async deleteGenesisJson(id: string): Promise<void> {
        const genesis = await this.getGenesisJson(id);

        await Promise.all(
            genesis.dataDirs.map((dir) => this.deleteDataDir(dir.id))
        );
        await fs.promises.unlink(genesis.filePath);
        await this.genesisRepository.delete({ id });
    }
    
    async initDataDir(dto: InitDataDirDto): Promise<void> {
        const genesis = await this.genesisRepository.findOne({ where: { id: dto.genesisId } });
        if (!genesis) {
            throw new NotFoundException();
        }

        const dir = path.join(this.genesisDir, uuidv4());

        await this.genesisEthService.initDataDir({
            genesisJsonPath: genesis.filePath,
            dataDir: dir,
        });

        await this.dataDirRepository.save(new DataDir({
            name: dto.name, dir, genesis
        }));
    }

    async getDataDir(dataDirId: string): Promise<DataDir> {
        const dir = await this.dataDirRepository.findOne({
            where: { id: dataDirId },
            relations: {
                genesis: true,
                node: true
            }
        });
        if (!dir) {
            throw new NotFoundException('Data dir not found');
        }

        return dir;
    }

    async deleteDataDir(dataDirId: string): Promise<void> {
        const dir = await this.getDataDir(dataDirId);

        if (dir.node) {
            throw new BadRequestException('Active node found');
        }
        
        await fs.promises.rm(dir.dir, { recursive: true, force: true });
        await this.dataDirRepository.delete({ id: dataDirId });
    }
}
