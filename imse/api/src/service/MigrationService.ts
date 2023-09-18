import { Inject, Injectable, forwardRef } from '@nestjs/common';

import * as repositories from '@/repository';
import * as services from '@/service';

@Injectable()
export class MigrationService {
  constructor(
    @Inject(repositories.SqlCuisineRepository) private readonly cuisineRepository: repositories.SqlCuisineRepository,
    @Inject(repositories.SqlIngredientRepository) private readonly ingredientRepository: repositories.SqlIngredientRepository,
    @Inject(repositories.SqlRecipeRepository) private readonly recipeRepository: repositories.SqlRecipeRepository,
    @Inject(repositories.SqlUserRepository) private readonly userRepository: repositories.SqlUserRepository,
    @Inject(repositories.NoSqlCuisineRepository) private readonly noSqlCuisineRepository: repositories.NoSqlCuisineRepository,
    @Inject(repositories.NoSqlIngredientRepository) private readonly noSqlIngredientRepository: repositories.NoSqlIngredientRepository,
    @Inject(repositories.NoSqlRecipeRepository) private readonly noSqlRecipeRepository: repositories.NoSqlRecipeRepository,
    @Inject(repositories.NoSqlUserRepository) private readonly nosqlUserRepository: repositories.NoSqlUserRepository,
    @Inject(forwardRef(() => services.SeedService)) private readonly seedService: services.SeedService
  ) { }

  public async runMigration(): Promise<void> {
    if (process.env.STORAGE_MODE === 'nosql') {
      await this.seedService.seed();
      process.env.STORAGE_MODE = 'sql';

      return;
    }

    const [
      users,
      ingrediends,
      cuisines,
      recipes
    ] = await Promise.all([
      this.userRepository.find(),
      this.ingredientRepository.find(),
      this.cuisineRepository.find(),
      this.recipeRepository.find(),
      this.noSqlCuisineRepository.delete(),
      this.noSqlRecipeRepository.delete(),
      this.noSqlIngredientRepository.delete(),
      this.nosqlUserRepository.delete()
    ]);

    await Promise.all(users.map((user) => this.nosqlUserRepository.create(user)));
    await Promise.all(ingrediends.map((ingredient) => this.noSqlIngredientRepository.save(ingredient)))
    await Promise.all(cuisines.map((cuisine) => this.noSqlCuisineRepository.save(cuisine)));
    await Promise.all(recipes.map((recipe) => this.noSqlRecipeRepository.save(recipe)));

    process.env.STORAGE_MODE = 'nosql';
  }
}
