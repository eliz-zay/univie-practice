import * as entities from '@/entity';

export abstract class AbstractRecipeRepository {
  public abstract find(ids?: string[]): Promise<entities.Recipe[]>;
  public abstract findById(id: string): Promise<entities.Recipe | null>;
  public abstract save(params: Partial<entities.Recipe>): Promise<entities.Recipe>;
  public abstract delete(): Promise<void>;
}
