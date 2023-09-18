import dotenv from 'dotenv';
import amqp from 'amqplib';

import { QueueManager } from '@queuemanager';
import { AnalyticsDomainService } from './service/AnalyticsDomainService';
import { createDataSource } from './data/data-source-creator';
import { HealthDomainService } from './service/HealthDomainService';

dotenv.config();

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

async function establishConnection(): Promise<void> {
    try {
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();

        const AppDataSource = createDataSource();
        await AppDataSource.initialize();

        const analyticsService = new AnalyticsDomainService(AppDataSource);
        const healthService = new HealthDomainService();

        QueueManager.setChannel(channel);

        await QueueManager.setUpTopicExchange('registration');
        await QueueManager.setUpTopicExchange('event-backup');
        await QueueManager.setUpTopicExchange('feedback-backup');

        await QueueManager.assertQueue('analytics:health');
        await QueueManager.assertQueue('analytics:top-commented');
        await QueueManager.assertQueue('analytics:top-rated');
        await QueueManager.assertQueue('analytics:top-attended');

        await QueueManager.assertQueue('event-backup:get-events-by-ids');
        await QueueManager.assertQueue('event-backup:get-events-by-ids:analytics');

        await QueueManager.setUpMicroserviceConsume('analytics:health', healthService.health.bind(healthService));
        await QueueManager.setUpMicroserviceConsume('analytics:top-commented', analyticsService.getTopCommented.bind(analyticsService));
        await QueueManager.setUpMicroserviceConsume('analytics:top-rated', analyticsService.getTopRated.bind(analyticsService));
        await QueueManager.setUpMicroserviceConsume('analytics:top-attended', analyticsService.getTopAttended.bind(analyticsService));

        await QueueManager.setUpRpcCallerConsume('event-backup:get-events-by-ids:analytics');
        
        await QueueManager.consumeTopicExchange('event-backup', 'event-backup:analytics', [
            {
                topicKey: 'create',
                callback: async (e) => analyticsService.onEventCreate(e)
            },
            {
                topicKey: 'delete',
                callback: async (e) => analyticsService.onEventDelete(e)
            }
        ]);

        await QueueManager.consumeTopicExchange('registration', 'registration:analytics', [
            {
                topicKey: 'create',
                callback: async (e) => analyticsService.onRegistrationCreate(e)
            },
            {
                topicKey: 'delete',
                callback: async (e) => analyticsService.onRegistrationDelete(e)
            }
        ]);

        await QueueManager.consumeTopicExchange('feedback-backup', 'feedback-backup:analytics', [
            {
                topicKey: 'create',
                callback: async (e) => analyticsService.onFeedbackCreate(e)
            }
        ]);
    } catch (err) {
        console.log(err);
    }
}

establishConnection();
