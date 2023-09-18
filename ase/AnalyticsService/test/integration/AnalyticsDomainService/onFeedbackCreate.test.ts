import { Repository } from 'typeorm';

import { AnalyticsDomainService } from '../../../src/service/AnalyticsDomainService';
import { Analytics } from '../../../src/model/Analytics';

import { cleanUpDatabase, getDataSource, useRepositories } from '../../util';

describe('AnalyticsDomainService.onFeedbackCreate', () => {
  let analyticsRepository: Repository<Analytics>;

  let service: AnalyticsDomainService;

  beforeAll(async () => {
    [analyticsRepository] = useRepositories([Analytics]);

    service = new AnalyticsDomainService(getDataSource());
  });

  afterEach(async () => {
    await cleanUpDatabase([Analytics]);
  });

  it('Successfully recalculates feedbackCount and feedbackRating', async () => {
    const eventId = 5;
    const overallRating = 10;

    const analytics = { eventId, attendeeCount: 10, feedbackCount: 3, feedbackRating: 6 };
    const analyticsAfterFeedback = {
      eventId,
      attendeeCount: 10,
      feedbackCount: analytics.feedbackCount + 1,
      feedbackRating: 7 // counted as (3 * 6 + 10) / (3 + 1)
    };

    await analyticsRepository.save(analytics);

    await service.onFeedbackCreate({ eventId, overallRating });

    const analyticsList = await analyticsRepository.find();

    expect(analyticsList).toHaveLength(1);
    expect(analyticsList[0]).toEqual(analyticsAfterFeedback);
  });

  it('Does not change database if analytics does not exist', async () => {
    await service.onFeedbackCreate({ eventId: 5, overallRating: 5 });

    const analyticsList = await analyticsRepository.find();

    expect(analyticsList).toHaveLength(0);
  });
});
