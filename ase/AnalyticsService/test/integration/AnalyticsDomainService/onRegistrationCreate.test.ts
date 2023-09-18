import { Repository } from 'typeorm';

import { AnalyticsDomainService } from '../../../src/service/AnalyticsDomainService';
import { Analytics } from '../../../src/model/Analytics';

import { cleanUpDatabase, getDataSource, useRepositories } from '../../util';

describe('AnalyticsDomainService.onRegistrationCreate', () => {
  let analyticsRepository: Repository<Analytics>;

  let service: AnalyticsDomainService;

  beforeAll(async () => {
    [analyticsRepository] = useRepositories([Analytics]);

    service = new AnalyticsDomainService(getDataSource());
  });

  afterEach(async () => {
    await cleanUpDatabase([Analytics]);
  });

  it('Successfully increments attendeeCount', async () => {
    const eventId = 5;
    const analytics = { eventId, attendeeCount: 1, feedbackCount: 2, feedbackRating: 3 };

    await analyticsRepository.save(analytics);

    await service.onRegistrationCreate({ eventId, attendeeId: 1 });

    const analyticsList = await analyticsRepository.find();

    expect(analyticsList).toHaveLength(1);
    expect(analyticsList[0]).toEqual({ ...analytics, attendeeCount: analytics.attendeeCount + 1 });
  });

  it('Does not change database if analytics does not exist', async () => {
    await service.onRegistrationCreate({ eventId: 5, attendeeId: 1 });

    const analyticsList = await analyticsRepository.find();

    expect(analyticsList).toHaveLength(0);
  });
});
