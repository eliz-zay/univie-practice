import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EthereumService, SmartContractService, MonitoringContractService } from './service';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env.sub' }),
    ],
    providers: [
        {
            provide: EthereumService,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const service = new EthereumService(configService);
                await service.unlockAccount();
                
                return service;
            }
        },
        {
            provide: SmartContractService,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const service = new SmartContractService(configService);
                await service.compileContracts();

                return service;
            }
        },
        {
            provide: MonitoringContractService,
            inject: [EthereumService, SmartContractService, ConfigService],
            useFactory: async (ethereumService: EthereumService, smartContractService: SmartContractService, configService: ConfigService) => {
                const service = new MonitoringContractService(ethereumService, smartContractService, configService);
                await service.connectToContract();

                return service;
            }
        }
    ],
})
export class SubModule {}
