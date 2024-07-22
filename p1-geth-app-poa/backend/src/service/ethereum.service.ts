import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Web3 } from 'web3';

@Injectable()
export class EthereumService {
    private web3: Web3;

    private readonly account: string;
    private readonly accountPassword: string;
    private readonly url: string;
    private readonly unlockDuration: number;

    private readonly isDevMode: boolean;

    constructor(configService: ConfigService) {
        this.account = configService.getOrThrow('ETH_ACCOUNT');
        this.accountPassword = configService.getOrThrow('ETH_ACCOUNT_PASSWORD');
        this.url = configService.getOrThrow('ETH_WS_URL');
        this.unlockDuration = Number(configService.getOrThrow('ETH_UNLOCK_SEC'));
        
        this.isDevMode = configService.get('DEV_MODE') ?? false;

        if (this.isDevMode) {
            return;
        }

        this.web3 = new Web3(new Web3.providers.WebsocketProvider(this.url));
    }

    async unlockAccount(): Promise<void> {
        if (this.isDevMode) {
            return;
        }

        const isAccountUnlocked = await this.web3.eth.personal.unlockAccount(
            this.account,
            this.accountPassword,
            this.unlockDuration
        );

        if (isAccountUnlocked) {
            Logger.log('Unlocked: ' + this.account);
        } else {
            throw new Error('Unlock failed: ' + this.account);
        }
    }

    getWeb3(): Web3 {
        return this.web3;
    }

    getAccount(): string {
        return this.account;
    }
}
