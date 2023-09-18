import { Repository } from 'typeorm';

import { QueueManager } from '@queuemanager';

import { AnalyticsDomainService } from '../../../src/service/AnalyticsDomainService';
import { Analytics } from '../../../src/model/Analytics';

import { cleanUpDatabase, getDataSource, useRepositories } from '../../util';

describe('AnalyticsDomainService.getTopAttended', () => {
  let analyticsRepository: Repository<Analytics>;

  let service: AnalyticsDomainService;

  beforeAll(async () => {
    [analyticsRepository] = useRepositories([Analytics]);

    service = new AnalyticsDomainService(getDataSource());
  });

  afterEach(async () => {
    await cleanUpDatabase([Analytics]);
  });

  it('Successfully gets top attended events', async () => {
    const eventAnalytics = [
      { eventId: 1, feedbackCount: 10, feedbackRating: 3, attendeeCount: 200 },
      { eventId: 2, feedbackCount: 6, feedbackRating: 4, attendeeCount: 100 },
      { eventId: 3, feedbackCount: 2, feedbackRating: 5, attendeeCount: 120 },
      { eventId: 4, feedbackCount: 14, feedbackRating: 3, attendeeCount: 250 },
      { eventId: 5, feedbackCount: 8, feedbackRating: 4, attendeeCount: 50 },
    ];
    const events = [
      { id: 1, organizerId: 3, title: 'Event #1' },
      { id: 4, organizerId: 1, title: 'Event #4' },
      { id: 2, organizerId: 3, title: 'Event #2' },
      { id: 3, organizerId: 6, title: 'Event #3' },
      { id: 5, organizerId: 4, title: 'Event #5' },
    ];
    const expectedResult = [
      {
        event: { id: 4, organizerId: 1, title: 'Event #4' },
        feedbackCount: 14,
        feedbackRating: 3,
        attendeeCount: 250
      },
      {
        event: { id: 1, organizerId: 3, title: 'Event #1' },
        feedbackCount: 10,
        feedbackRating: 3,
        attendeeCount: 200
      },
      {
        event: { id: 3, organizerId: 6, title: 'Event #3' },
        feedbackCount: 2,
        feedbackRating: 5,
        attendeeCount: 120
      }
    ];

    await analyticsRepository.save(eventAnalytics);

    QueueManager.callRpcWithReplyTo = jest.fn().mockResolvedValue({ payload: events })

    const result = await service.getTopAttended({ user: { id: 1 }, count: 3 });

    expect(result).toStrictEqual(expectedResult);
  });

  it('Throws error when RPC fails to return events', async () => {
    const eventAnalytics = [
      { eventId: 1, feedbackCount: 10, feedbackRating: 3, attendeeCount: 200 },
      { eventId: 2, feedbackCount: 6, feedbackRating: 4, attendeeCount: 100 },
      { eventId: 3, feedbackCount: 2, feedbackRating: 5, attendeeCount: 120 },
      { eventId: 4, feedbackCount: 14, feedbackRating: 3, attendeeCount: 250 },
      { eventId: 5, feedbackCount: 8, feedbackRating: 4, attendeeCount: 50 },
    ];

    await analyticsRepository.save(eventAnalytics);

    QueueManager.callRpcWithReplyTo = jest.fn().mockResolvedValue({ })

    await expect(service.getTopAttended({ user: { id: 1 }, count: 3 })).rejects.toEqual({ errorCode: 500, message: 'Internal error' })
  });
});
