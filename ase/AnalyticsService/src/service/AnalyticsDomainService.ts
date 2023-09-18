import { DataSource, Repository } from 'typeorm';
import { QueueManager } from '@queuemanager';
import { Analytics } from '../model/Analytics';
import { EventSchema, IdSchema, OnFeedbackReq, OnFeedbackSchema, OnRegistrationReq, OnRegistrationSchema, ReportItemSchema, UserAndCountReq, UserAndCountSchema } from './AnalyticsDomainService.schema';

export class AnalyticsDomainService {
    private readonly analyticsRepository: Repository<Analytics>;

    constructor(dataSource: DataSource) {
        this.analyticsRepository = dataSource.getRepository(Analytics);
    }

    async getTopCommented(message: UserAndCountReq): Promise<ReportItemSchema[]> {
        await UserAndCountSchema.validate(message).catch((e) => {
            throw { errorCode: 400, message: e.message }
        });

        const items = await this.analyticsRepository.find({
            order: { feedbackCount: 'DESC' },
            take: message.count
        });

        return this.getItemsWithEvents(items);
    }

    async getTopRated(message: UserAndCountReq): Promise<ReportItemSchema[]> {
        await UserAndCountSchema.validate(message).catch((e) => {
            throw { errorCode: 400, message: e.message }
        });

        const items = await this.analyticsRepository.find({
            order: { feedbackRating: 'DESC' },
            take: message.count
        });

        return this.getItemsWithEvents(items);
    }

    async getTopAttended(message: UserAndCountReq): Promise<ReportItemSchema[]> {
        await UserAndCountSchema.validate(message).catch((e) => {
            throw { errorCode: 400, message: e.message }
        });

        const items = await this.analyticsRepository.find({
            order: { attendeeCount: 'DESC' },
            take: message.count
        });

        return this.getItemsWithEvents(items);
    }

    async onEventCreate(payload: { id: number; }): Promise<void> {
        await IdSchema.validate(payload.id).catch((e) => {
            console.log(e.message);
        });

        if (await this.analyticsRepository.findOne({ where: { eventId: payload.id } })) {
            return;
        }

        const analytics = new Analytics();
        analytics.eventId = payload.id;
        analytics.attendeeCount = 0;
        analytics.feedbackCount = 0;
        analytics.feedbackRating = 0;

        await this.analyticsRepository.save(analytics);
    }

    async onEventDelete(payload: { id: number; }): Promise<void> {
        await IdSchema.validate(payload.id).catch((e) => {
            console.log(e.message);
        });

        await this.analyticsRepository.delete(payload.id);
    }

    async onRegistrationCreate(payload: OnRegistrationReq): Promise<void> {
        await OnRegistrationSchema.validate(payload).catch((e) => {
            console.log(e.message);
        });

        const item = await this.analyticsRepository.findOne({ where: { eventId: payload.eventId } });
        if (!item) {
            return;
        }

        await this.analyticsRepository.update(item, {
            attendeeCount: item.attendeeCount + 1
        });
    }

    async onRegistrationDelete(payload: OnRegistrationReq): Promise<void> {
        await OnRegistrationSchema.validate(payload).catch((e) => {
            console.log(e.message);
        });

        const item = await this.analyticsRepository.findOne({ where: { eventId: payload.eventId } });
        if (!item) {
            return;
        }
        
        await this.analyticsRepository.update(item, {
            attendeeCount: item.attendeeCount - 1
        });
    }

    async onFeedbackCreate(payload: OnFeedbackReq): Promise<void> {
        await OnFeedbackSchema.validate(payload).catch((e) => {
            console.log(e.message);
        });

        const item = await this.analyticsRepository.findOne({ where: { eventId: payload.eventId } });
        if (!item) {
            return;
        }

        const oldRatingSum = item.feedbackCount * item.feedbackRating;

        item.feedbackCount += 1;
        item.feedbackRating = (oldRatingSum + payload.overallRating) / item.feedbackCount;
        item.feedbackRating = Math.round(item.feedbackRating * 100) / 100;

        await this.analyticsRepository.save(item);
    }

    private async getItemsWithEvents(items: Analytics[]): Promise<ReportItemSchema[]> {
        const eventIds = items.map((item) => item.eventId);
        const events = await this.getEvents(eventIds);

        return items.map((item) => ({
            event: events.find((event) => event.id === item.eventId)!,
            feedbackCount: item.feedbackCount,
            feedbackRating: item.feedbackRating,
            attendeeCount: item.attendeeCount
        }));
    }

    private async getEvents(ids: number[]): Promise<EventSchema[]> {
        const rpcResponse = await QueueManager.callRpcWithReplyTo(
            'event-backup:get-events-by-ids',
            'event-backup:get-events-by-ids:analytics',
            { ids }
        );

        if (!Array.isArray(rpcResponse.payload)) {
            console.log('Events not found');
            throw { errorCode: 500, message: 'Internal error' };
        }

        return rpcResponse.payload;
    }
}
