import * as entities from '@/entity';

import { GetReportParams, ReportItem } from './types';

export abstract class AbstractCuisineRepository {
  public abstract find(): Promise<entities.Cuisine[]>;
  public abstract findById(id: string): Promise<entities.Cuisine | null>;
  public abstract getCuisineReport(params: GetReportParams): Promise<ReportItem[]>;
  public abstract save(cuisine: Partial<entities.Cuisine>): Promise<entities.Cuisine>;
  public abstract update(id: string, cuisine: Partial<entities.Cuisine>): Promise<void>;
  public abstract delete(): Promise<void>;
}
