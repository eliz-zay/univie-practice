import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import config from 'config/config';
import { BackendModule } from './backend/backend.module';
import { EthManagerModule } from './eth-manager/eth-manager.module';

/**
 * Main module
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config]
        }),
        EthManagerModule,
        BackendModule
    ],
})
export class AppModule {}
