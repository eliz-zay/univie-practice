import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { AccountDto, CreateAccountRequest } from '../dto';
import { AccountService as EthAccountService } from '../../eth-manager/service';
import { In, Repository } from 'typeorm';
import { Account } from '../model';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Creates, gets, deletes accounts
 */
@Injectable()
export class AccountService {
    constructor(
        private readonly ethAccountService: EthAccountService,
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>
    ) {}

    async createAccount(dto: CreateAccountRequest): Promise<void> {
        const accounts = await this.getAccountList();
        if (accounts.find((a) => a.name === dto.name)) {
            throw new BadRequestException('Account with this name already exists');
        }

        const { address, secretKeyPath } = await this.ethAccountService.createAccount(dto);

        await this.accountRepository.save(new Account({
            name: dto.name,
            secretKeyPath,
            address,
            password: dto.password
        }));
    }

    async getAccountList(ids?: string[]): Promise<AccountDto[]> {
        return this.accountRepository.find({
            where: ids?.length ? { id: In(ids) } : {}
        });
    }

    async getAccount(id: string): Promise<Account> {
        const account = await this.accountRepository.findOne({ where: { id } });
        if (!account) {
            throw new NotFoundException('Account not found');
        }

        return account;
    }

    async deleteAccount(id: string): Promise<void> {
        const account = await this.accountRepository.findOne({
            where: { id },
            relations: {
                genesis: true
            }
        });
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        if (account.genesis.length) {
            throw new BadRequestException('Account is referenced by genesis JSONs');
        }

        await this.accountRepository.delete({ id });
        await fs.promises.unlink(account.secretKeyPath);
    }
}
