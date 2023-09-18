import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import * as entities from '@/entity';
import * as sqlModels from '@/sql-model';

import { AbstractCuisineRepository } from './AbstractCuisineRepository';
import { GetReportParams, ReportItem } from './types';

export class SqlCuisineRepository extends AbstractCuisineRepository {
  constructor(
    @InjectRepository(sqlModels.Cuisine)
    private readonly cuisineRepository: Repository<sqlModels.Cuisine>,
  ) {
    super();
  }

  public async find(): Promise<entities.Cuisine[]> {
    const cuisines = await this.cuisineRepository.find({
      relations: { likedByUsers: true },
    });

    return cuisines.map((cuisine) => ({
      ...cuisine,
      likedByUsers: cuisine.likedByUsers.map((user) => ({
        id: user.id,
        username: user.username,
      })),
    }));
  }

  public findById(id: string): Promise<entities.Cuisine | null> {
    return this.cuisineRepository.findOne({
      where: { id },
      relations: { likedByUsers: true },
      order: { id: 'ASC' },
    });
  }

  public async getCuisineReport(
    params: GetReportParams,
  ): Promise<ReportItem[]> {
    const { userId, count } = params;

    return this.cuisineRepository.manager.query(`
      select
        c.*,
        count(userlike.user_id)::int "likedFriendsCount",
        (
          select count(rc.recipe_id) from recipe_cuisines_cuisine rc
          where rc.cuisine_id = c.id
        )::int "recipeCount"
      from cuisine c
      left join users_liked_cuisines_cuisine userlike on userlike.cuisine_id = c.id
      where userlike.user_id in (
        select (
          case when f.receiver_id = u.id then f.initiator_id else f.receiver_id end
        ) id from users u
        left join user_friend f on ((f.receiver_id = u.id or f.initiator_id = u.id) and f.is_accepted)
        where u.id = $1
      )
      group by c.id
      order by "recipeCount" desc
      limit $2
    `, [userId, count]);
  }

  public save(cuisine: Partial<entities.Cuisine>): Promise<entities.Cuisine> {
    return this.cuisineRepository.save(cuisine);
  }

  public async update(
    id: string,
    cuisine: Partial<entities.Cuisine>,
  ): Promise<void> {
    await this.cuisineRepository.save({ ...cuisine, id });
  }

  public async delete(): Promise<void> {
    await this.cuisineRepository.delete({});
  }
}
