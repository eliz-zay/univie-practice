import { Message } from '../../src/model/Message';
import { Registration } from '../../src/model/Registration';
import { AttendanceDomainService } from '../../src/service/AttendanceDomainService';
import { Repository } from 'typeorm';
import { registrations } from '../fixtures/registrations';
import { users } from '../fixtures/users';
import { events } from '../fixtures/events';
import { messages } from '../fixtures/messages';
import { QueueManager } from '@queuemanager';

describe('AttendanceDomainService', () => {
    beforeAll(async () => {
        QueueManager.publishToTopicExchange = jest.fn().mockImplementation();

        QueueManager.callRpcWithReplyTo = jest.fn().mockImplementation((q1: string, ...args) => {
            if (q1 === 'event-backup:get-events-by-ids') {
                return { payload: events };
            }
            if (q1 === 'login:get-users-by-ids') {
                return { payload: users };
            }
        });
    });

    it('Successfully registers', async () => {
        const registrationRepository = {
            find: jest.fn().mockResolvedValue([registrations[0]]),
            findOne: jest.fn().mockImplementation((p: { where: { attendeeId: number; eventId: number; }}) => {
                return registrations.find((r) => r.attendeeId === p.where.attendeeId && r.eventId === p.where.eventId);
            }),
            save: jest.fn().mockResolvedValue(registrations[1]),
        };

        const service = new AttendanceDomainService(
            registrationRepository as unknown as Repository<Registration>,
            {} as unknown as Repository<Message>,
        );

        await service.registerToEvent({ user: users[0], eventId: events[1].id });
    });

    it('Stops registration, because event capacity is exceeded', async () => {
        const registrationRepository = {
            find: jest.fn().mockResolvedValue(registrations),
            findOne: jest.fn().mockImplementation((p: { where: { attendeeId: number; eventId: number; }}) => {
                return registrations.find((r) => r.attendeeId === p.where.attendeeId && r.eventId === p.where.eventId);
            }),
            save: jest.fn().mockResolvedValue(registrations[1]),
        };

        const service = new AttendanceDomainService(
            registrationRepository as unknown as Repository<Registration>,
            {} as unknown as Repository<Message>,
        );

        await expect(service.registerToEvent({ user: users[1], eventId: events[0].id })).rejects.toEqual({ errorCode: 400, message: 'No free spaces left' })
    });

    it('Successfully deregisters', async () => {
        const registrationRepository = {
            findOne: jest.fn().mockImplementation((p: { where: { attendeeId: number; eventId: number; }}) => {
                return registrations.find((r) => r.attendeeId === p.where.attendeeId && r.eventId === p.where.eventId);
            }),
            delete: jest.fn().mockResolvedValue(null),
        };

        const service = new AttendanceDomainService(
            registrationRepository as unknown as Repository<Registration>,
            {} as unknown as Repository<Message>,
        );

        await service.deregisterFromEvent({ user: users[0], eventId: events[0].id });
    });

    it('Successfully creates message', async () => {
        const messageRepository = {
            save: jest.fn().mockResolvedValue(messages[0]),
        };
        
        const service = new AttendanceDomainService(
            {} as unknown as Repository<Registration>,
            messageRepository as unknown as Repository<Message>,
        );

        const message = await service.sendOrganizerMessage({
            user: { id: messages[0].senderId },
            eventId: messages[0].eventId,
            text: messages[0].text
        });

        expect(message).toMatchObject(messages[0]);

        try {
            const messageRejected = await service.sendOrganizerMessage({
                user: { id: messages[0].senderId + 1 },
                eventId: messages[0].eventId,
                text: messages[0].text
            });
            expect(messageRejected).toBe(undefined);
        } catch (err) {
            expect(err).toHaveProperty('errorCode', 403);
        }
    });

    it('Successfully gets event messages', async () => {
        const messageRepository = {
            find: jest.fn().mockResolvedValue(messages),
        };
        const registrationRepository = {
            findOne: jest.fn().mockImplementation((p: { where: { attendeeId: number; eventId: number; }}) => {
                return registrations.find((r) => r.attendeeId === p.where.attendeeId && r.eventId === p.where.eventId);
            }),
        };
        
        const service = new AttendanceDomainService(
            registrationRepository as unknown as Repository<Registration>,
            messageRepository as unknown as Repository<Message>,
        );

        const eventMessages = await service.getEventMessages({
            user: { id: registrations[0].attendeeId },
            eventId: registrations[0].eventId
        });

        expect(eventMessages).toHaveLength(3);
    });

    it('Successfully gets event attendees', async () => {
        const registrationRepository = {
            find: jest.fn().mockImplementation(() => []),
        };
        
        const service = new AttendanceDomainService(
            registrationRepository as unknown as Repository<Registration>,
            {} as unknown as Repository<Message>,
        );

        const attendees = await service.getEventAttendees({
            user: { id: events[0].organizerId },
            eventId: events[0].id
        });

        expect(attendees).toHaveLength(3);
    });

    it('Successfully gets attendee events', async () => {
        const registrationRepository = {
            find: jest.fn().mockImplementation(() => [registrations[0], registrations[1]]),
        };
        
        const service = new AttendanceDomainService(
            registrationRepository as unknown as Repository<Registration>,
            {} as unknown as Repository<Message>,
        );

        const attendees = await service.getEventAttendees({
            user: { id: events[0].organizerId },
            eventId: events[0].id
        });

        expect(attendees).toHaveLength(3);
    });

    it('On event delete, successfully deletes messages/registrations', async () => {
        const registrationRepository = {
            delete: jest.fn().mockResolvedValue(null)
        };
        const messageRepository = {
            delete: jest.fn().mockResolvedValue(null)
        };

        const service = new AttendanceDomainService(
            registrationRepository as unknown as Repository<Registration>,
            messageRepository as unknown as Repository<Message>,
        );

        await service.onEventDelete(events[0].id);

        expect(registrationRepository.delete).toBeCalledTimes(1);
        expect(messageRepository.delete).toBeCalledTimes(1);
    });
});
