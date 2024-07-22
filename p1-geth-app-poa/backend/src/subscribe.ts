import { NestFactory } from '@nestjs/core';
import { SubModule } from './sub.module';
import { MonitoringContractService } from './service';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { documentModel } from './model';

interface DecisionCreatedEvent {
    decisionAddress: string;
    id: number;
}

async function bootstrap() {
    const app = await NestFactory.create(SubModule);

    const monitoringContractService = app.get(MonitoringContractService);
    const configService = app.get(ConfigService);

    const dbUrl = configService.getOrThrow('DB_URL');
    const dbName = configService.getOrThrow('DB_NAME');

    await mongoose.connect(dbUrl, { dbName });

    const contract = monitoringContractService.getContract();

    /**
     * Subscribe to Monitoring Contract events
     */

    const decisionCreatedEvent = contract.events.DecisionCreated({});

    decisionCreatedEvent.on('connected', () => {
        console.log('Subscribed to "DecisionCreated" event...');
    });

    decisionCreatedEvent.on('data', async (event) => {
        console.log('Event: ', event);
        
        const values = event.returnValues as any as DecisionCreatedEvent;
        
        console.log(`Decision address: ${values.decisionAddress}, id: ${values.id}`);

        await documentModel.updateOne({ _id: values.id }, { contractAddress: values.decisionAddress });
    });

    decisionCreatedEvent.on('error', (error) => {
        console.log('Event error:', error);
    });
}

bootstrap();
