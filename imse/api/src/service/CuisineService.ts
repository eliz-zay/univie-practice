import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import * as infrastructure from '@/infrastructure';
import * as entities from '@/entity';
import * as repositories from '@/repository';
import * as services from '@/service';

import * as types from '@/service/CuisineService.types';

@Injectable()
export class CuisineService {
  private readonly reportCuisineLength = 10;

  constructor(
    @infrastructure.InjectRepository(entities.Cuisine)
    private readonly cuisineRepository: repositories.AbstractCuisineRepository,
    @Inject(forwardRef(() => services.UserFriendService))
    private readonly friendService: services.UserFriendService,
    @Inject(forwardRef(() => services.UserService))
    private readonly userService: services.UserService,
  ) {}

  async getCuisines() {
    return this.cuisineRepository.find();
  }

  async toggleLike(user: entities.User, id: string): Promise<void> {
    const cuisine = await this.cuisineRepository.findById(id);

    if (!cuisine) {
      throw new NotFoundException(`Cuisine with id ${id} not found.`);
    }

    let likes = [...(cuisine.likedByUsers ?? [])];

    if (likes!.find((u) => u.id === user.id)) {
      likes = likes.filter((u) => u.id !== user.id);
    } else {
      likes.push(user);
    }

    await this.cuisineRepository.update(id, { likedByUsers: likes });
  }

  async getReport(username: string): Promise<types.CuisineReport[]> {
    const user = await this.userService.getUserByUsername(username);
    const friends = await this.friendService.getFriends(user);
    const totalFriendCount = friends.length;

    const cuisines = await this.cuisineRepository.getCuisineReport({
      userId: user.id,
      count: this.reportCuisineLength,
    });

    return cuisines.map((c) => ({
      cuisine: {
        id: c.id,
        country: c.country,
        description: c.description
      },
      likedFriendsCount: c.likedFriendsCount,
      likedFriendsPercent: Math.round(c.likedFriendsCount / totalFriendCount * 100),
      recipeCount: c.recipeCount
    }));
  }
}
