import * as entities from '@/entity';

export abstract class AbstractUserRepository {
  public abstract create(params: Partial<entities.User>): Promise<entities.User>;
  public abstract find(): Promise<entities.User[]>;
  public abstract findById(id: string): Promise<entities.User | null>;
  public abstract findByUsername(username: string): Promise<entities.User | null>;
  public abstract delete(): Promise<void>;
}
