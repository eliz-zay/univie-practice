import dotenv from 'dotenv';
import amqp from 'amqplib';

import { QueueManager } from '@queuemanager';
import { AttendanceDomainService } from './service/AttendanceDomainService';
import { createDataSource } from './data/data-source-creator';
import { Registration } from './model/Registration';
import { Message } from './model/Message';
import { HealthDomainService } from './service/HealthDomainService';

dotenv.config();

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

async function establishConnection(): Promise<void> {
    try {
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();

        const AppDataSource = createDataSource();
        await AppDataSource.initialize();
        
        const attendanceService = new AttendanceDomainService(
            AppDataSource.getRepository(Registration),
            AppDataSource.getRepository(Message)
        );
        const healthService = new HealthDomainService();

        QueueManager.setChannel(channel);

        await QueueManager.setUpTopicExchange('registration');
        await QueueManager.setUpTopicExchange('event-backup');

        await QueueManager.assertQueue('attendance:health');
        await QueueManager.assertQueue('attendance:register');
        await QueueManager.assertQueue('attendance:deregister');
        await QueueManager.assertQueue('attendance:send-message');
        await QueueManager.assertQueue('attendance:get-event-messages');
        await QueueManager.assertQueue('attendance:get-event-attendees');
        await QueueManager.assertQueue('attendance:get-attendee-events');
        await QueueManager.assertQueue('attendance:event-backup:get-events');

        await QueueManager.assertQueue('event-backup:get-events-by-ids');
        await QueueManager.assertQueue('event-backup:get-events-by-ids:attendance-service');
        await QueueManager.assertQueue('login:get-users-by-ids');
        await QueueManager.assertQueue('login:get-users-by-ids:attendance-service');

        await QueueManager.setUpMicroserviceConsume('attendance:health', healthService.health.bind(healthService));
        await QueueManager.setUpMicroserviceConsume('attendance:register', attendanceService.registerToEvent.bind(attendanceService));
        await QueueManager.setUpMicroserviceConsume('attendance:deregister', attendanceService.deregisterFromEvent.bind(attendanceService));
        await QueueManager.setUpMicroserviceConsume('attendance:send-message', attendanceService.sendOrganizerMessage.bind(attendanceService));
        await QueueManager.setUpMicroserviceConsume('attendance:get-event-messages', attendanceService.getEventMessages.bind(attendanceService));
        await QueueManager.setUpMicroserviceConsume('attendance:get-event-attendees', attendanceService.getEventAttendees.bind(attendanceService));
        await QueueManager.setUpMicroserviceConsume('attendance:get-attendee-events', attendanceService.getAttendeeEvents.bind(attendanceService));

        await QueueManager.setUpRpcCallerConsume('event-backup:get-events-by-ids:attendance-service');
        await QueueManager.setUpRpcCallerConsume('login:get-users-by-ids:attendance-service');
        
        await QueueManager.consumeTopicExchange('event-backup', 'event-backup:attendance', [
            {
                topicKey: 'delete',
                callback: async (e) => {
                    await attendanceService.onEventDelete(e.id);
                }
            }
        ]);

        
    } catch (err) {
        console.log(err);
    }
}

establishConnection();
