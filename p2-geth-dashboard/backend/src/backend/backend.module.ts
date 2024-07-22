import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService} from '@nestjs/config';
import config from 'config/config';
import { AccountController, GenesisController, NodeController } from './controller';
import { EthManagerModule } from '../eth-manager/eth-manager.module';
import { AccountService, EthManagerService, GenesisService, NodeService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Account, DataDir, Genesis, GenesisAccount, Node } from './model';

/**
 * Backend module: provides API, operates PostgreSQL and uses EthManagerModule functionality
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config]
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('db').host,
                port: configService.get('db').port,
                username: configService.get('db').username,
                password: configService.get('db').password,
                database: configService.get('db').name,
                entities: [
                    Account,
                    GenesisAccount,
                    Genesis,
                    DataDir,
                    Node
                ],
                synchronize: true,
                namingStrategy: new SnakeNamingStrategy(),
                logging: ['error'],
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([
            Account,
            GenesisAccount,
            Genesis,
            DataDir,
            Node
        ]),
        EthManagerModule
    ],
    providers: [
        EthManagerService,
        NodeService,
        AccountService,
        GenesisService,
    ],
    controllers: [
        NodeController,
        AccountController,
        GenesisController
    ],
})
export class BackendModule {}
