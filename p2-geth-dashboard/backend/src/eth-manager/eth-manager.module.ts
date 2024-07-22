import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import config from 'config/config';

import { AccountService, GenesisService, MonitoringService, RpcService, SpawnerService } from './service';

/**
 * Go-ethereum manager: create genesis.json files, configure/spawn/kill nodes, initialize accounts, etc.
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config]
        }),
    ],
    providers: [
        MonitoringService,
        RpcService,
        SpawnerService,
        AccountService,
        GenesisService
    ],
    exports: [
        MonitoringService,
        SpawnerService,
        AccountService,
        GenesisService
    ]
})
export class EthManagerModule {}
