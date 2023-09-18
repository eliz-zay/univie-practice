import { Repository } from 'typeorm';

import { AnalyticsDomainService } from '../../../src/service/AnalyticsDomainService';
import { Analytics } from '../../../src/model/Analytics';

import { cleanUpDatabase, getDataSource, useRepositories } from '../../util';

describe('AnalyticsDomainService.onEventDelete', () => {
  let analyticsRepository: Repository<Analytics>;

  let service: AnalyticsDomainService;

  beforeAll(async () => {
    [analyticsRepository] = useRepositories([Analytics]);

    service = new AnalyticsDomainService(getDataSource());
  });

  afterEach(async () => {
    await cleanUpDatabase([Analytics]);
  });

  it('Successfully deletes analytics model', async () => {
    const eventId = 5;
    const analytics = { eventId, attendeeCount: 0, feedbackCount: 0, feedbackRating: 0 };

    await analyticsRepository.save(analytics);

    await service.onEventDelete({ id: eventId });

    const analyticsList = await analyticsRepository.find();

    expect(analyticsList).toHaveLength(0);
  });
});
