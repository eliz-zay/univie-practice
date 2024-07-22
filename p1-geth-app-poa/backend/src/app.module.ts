import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EthereumService, DocumentService, SignatureService, SmartContractService, UserService, MonitoringContractService, DecisionContractService } from './service';
import { DocumentController, SignatureController, UserController } from './controller';

@Module({
    imports: [
        ConfigModule.forRoot(),
    ],
    providers: [
        DocumentService,
        UserService,
        SignatureService,
        DecisionContractService,
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
    controllers: [
        DocumentController,
        UserController,
        SignatureController,
    ],
})
export class AppModule {}
