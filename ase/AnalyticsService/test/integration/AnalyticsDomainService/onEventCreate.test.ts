import { Repository } from 'typeorm';

import { AnalyticsDomainService } from '../../../src/service/AnalyticsDomainService';
import { Analytics } from '../../../src/model/Analytics';

import { cleanUpDatabase, getDataSource, useRepositories } from '../../util';

describe('AnalyticsDomainService.onEventCreate', () => {
  let analyticsRepository: Repository<Analytics>;

  let service: AnalyticsDomainService;

  beforeAll(async () => {
    [analyticsRepository] = useRepositories([Analytics]);

    service = new AnalyticsDomainService(getDataSource());
  });

  afterEach(async () => {
    await cleanUpDatabase([Analytics]);
  });

  it('Successfully creates analytics model', async () => {
    const eventId = 5;
    const expectedAnalytics = { eventId, attendeeCount: 0, feedbackCount: 0, feedbackRating: 0 };

    await service.onEventCreate({ id: eventId });

    const analyticsList = await analyticsRepository.find();

    expect(analyticsList).toHaveLength(1);
    expect(analyticsList[0]).toEqual(expectedAnalytics);
  });

  it('Does not create analytics model if it is already created for given event', async () => {
    const eventId = 5;
    const analytics = { eventId, attendeeCount: 0, feedbackCount: 0, feedbackRating: 0 };

    await analyticsRepository.save(analytics);
    const analyticsListBefore = await analyticsRepository.find();

    await service.onEventCreate({ id: eventId });

    const analyticsListAfter = await analyticsRepository.find();

    expect(analyticsListBefore).toEqual(analyticsListAfter);
  });
});
