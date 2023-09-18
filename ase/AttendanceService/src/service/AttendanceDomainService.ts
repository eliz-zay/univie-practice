import { Repository } from 'typeorm';
import { AttendeeSchema, EventSchema, MessageSchema, UserAndEventSchema, toMessageSchema, AddMessageSchema, UserAndEventReq, AddMessageReq, UserReq, UserSchema, IdSchema } from './AttendanceDomainService.schema';
import { Registration } from '../model/Registration';
import { Message } from '../model/Message';
import { QueueManager } from '@queuemanager';

export class AttendanceDomainService {
    constructor(
        private readonly registrationRepository: Repository<Registration>,
        private readonly messageRepository: Repository<Message>
    ) {}

    async registerToEvent(message: UserAndEventReq): Promise<void> {
        await UserAndEventSchema.validate(message).catch((e) => {
            throw { errorCode: 400, message: e.message }
        });

        const event = await this.getEvent(message.eventId);

        const registraion = await this.registrationRepository.findOne({
            where: { attendeeId: message.user.id, eventId: message.eventId }
        });

        if (registraion) {
            throw { errorCode: 400, message: 'Registration already exists' };
        }

        const registrations = await this.registrationRepository.find({
            where: { eventId: message.eventId }
        });

        if (registrations.length === event.capacity) {
            throw { errorCode: 400, message: 'No free spaces left' };
        }

        await this.registrationRepository.save({ attendeeId: message.user.id, eventId: message.eventId });

        await QueueManager.publishToTopicExchange('registration', 'create', {
            attendeeId: message.user.id, eventId: message.eventId
        });
    }

    async deregisterFromEvent(message: UserAndEventReq): Promise<void> {
        await UserAndEventSchema.validate(message).catch((e) => {
            throw { errorCode: 400, message: e.message }
        });

        await this.getEvent(message.eventId);

        const registraion = await this.registrationRepository.findOne({
            where: { attendeeId: message.user.id, eventId: message.eventId }
        });

        if (!registraion) {
            throw { errorCode: 400, message: 'Registration does not exist' };
        }

        await this.registrationRepository.delete({ attendeeId: message.user.id, eventId: message.eventId });

        await QueueManager.publishToTopicExchange('registration', 'delete', {
            attendeeId: message.user.id, eventId: message.eventId
        });
    }

    async sendOrganizerMessage(message: AddMessageReq): Promise<MessageSchema> {
        await AddMessageSchema.validate(message).catch((e) => {
            throw { errorCode: 400, message: e.message }
        });

        const event = await this.getEvent(message.eventId);

        if (message.user.id !== event.organizerId) {
            throw { errorCode: 403, message: 'Only organizer of the event can send messages' };
        }

        const orgMessage = await this.messageRepository.save({
            eventId: message.eventId,
            senderId: message.user.id,
            text: message.text
        });

        return toMessageSchema(orgMessage);
    }

    async getEventMessages(message: UserAndEventReq): Promise<MessageSchema[]> {
        await UserAndEventSchema.validate(message).catch((e) => {
            throw { errorCode: 400, message: e.message }
        });

        const event = await this.getEvent(message.eventId);

        const registration = await this.registrationRepository.findOne({
            where: { attendeeId: message.user.id, eventId: message.eventId }
        });
        if (!registration && message.user.id !== event.organizerId) {
            throw { errorCode: 400, message: 'Only attendees and organizer can see messages' };
        }

        const messages = await this.messageRepository.find({
            where: { eventId: message.eventId }
        });

        return messages.map(toMessageSchema);
    }

    async getEventAttendees(message: UserAndEventReq): Promise<AttendeeSchema[]> {
        await UserAndEventSchema.validate(message).catch((e) => {
            throw { errorCode: 400, message: e.message }
        });
        
        const event = await this.getEvent(message.eventId);

        if (message.user.id !== event.organizerId) {
            throw { errorCode: 403, message: 'Only organizer can see attendees' };
        }

        const registraions = await this.registrationRepository.find({
            where: { eventId: message.eventId }
        });

        const attendees = await this.getUsers(registraions.map((r) => r.attendeeId));

        return attendees;
    }

    async getAttendeeEvents(message: UserReq): Promise<EventSchema[]> {
        await UserSchema.validate(message).catch((e) => {
            throw { errorCode: 400, message: e.message }
        });

        const registraions = await this.registrationRepository.find({
            where: { attendeeId: message.user.id }
        });

        const eventIds = registraions.map((r) => r.eventId);
        const events = await this.getEvents(eventIds);

        return events;
    }

    async onEventDelete(eventId: number): Promise<void> {
        await IdSchema.validate(eventId).catch((e) => {
            console.log(e.message);
        });

        await Promise.all([
            this.registrationRepository.delete({ eventId }),
            this.messageRepository.delete({ eventId })
        ]);
    }

    private async getEvent(id: number): Promise<EventSchema> {
        const rpcResponse = await QueueManager.callRpcWithReplyTo(
            'event-backup:get-events-by-ids',
            'event-backup:get-events-by-ids:attendance-service',
            { ids: [id] }
        );

        if (!rpcResponse.payload[0]) {
            throw { errorCode: 400, message: 'Event not found' };
        }
        
        return rpcResponse.payload[0];
    }

    private async getEvents(ids: number[]): Promise<EventSchema[]> {
        const rpcResponse = await QueueManager.callRpcWithReplyTo(
            'event-backup:get-events-by-ids',
            'event-backup:get-events-by-ids:attendance-service',
            { ids }
        );
        
        return rpcResponse.payload;
    }

    private async getUsers(ids: number[]): Promise<AttendeeSchema[]> {
        const rpcResponse = await QueueManager.callRpcWithReplyTo(
            'login:get-users-by-ids',
            'login:get-users-by-ids:attendance-service',
            { ids }
        );
        
        return rpcResponse.payload;
    }
}
