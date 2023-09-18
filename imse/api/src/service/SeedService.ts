import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import {
  User,
  UserFriend,
  Cuisine,
  RecipeComment,
  Recipe,
  Ingredient,
  RecipeIngredient,
} from '@/sql-model';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserFriend)
    private readonly friendRepository: Repository<UserFriend>,
    @InjectRepository(Cuisine)
    private readonly cuisineRepository: Repository<Cuisine>,
    @InjectRepository(RecipeComment)
    private readonly commentRepository: Repository<RecipeComment>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredientRepository: Repository<RecipeIngredient>,
  ) {}

  async seed() {
    await this.drop();

    const users = await this.createUsers();

    await this.createFriends(users);

    const cuisines = await this.createCuisines(users);

    const ingredients = await this.createIngredients();

    const recipes = await this.createRecipies(cuisines);

    await this.createRecipeIngredients(recipes, ingredients);

    await this.createComments(users, recipes);
  }

  private async createUsers(): Promise<User[]> {
    const users = faker.helpers.multiple(
      () => ({
        username: faker.internet.userName(),
        password: faker.internet.password(),
      }),
      { count: 10 },
    );

    return this.userRepository.save(users);
  }

  private async createFriends(users: User[]): Promise<void> {
    const friends: [User, User[]][] = [];

    users.forEach((user, i) => {
      friends.push([user, users.filter((u, j) => j > i + users.length / 4)]);
    });

    const pairs = friends.flatMap(([user, userFriends]) =>
      userFriends.flatMap((friend) => ({
        initiator: user,
        receiver: friend,
        isAccepted: true,
      })),
    );

    await this.friendRepository.save(pairs);
  }

  private async createCuisines(users: User[]): Promise<Cuisine[]> {
    const cuisines = faker.helpers.multiple(
      () => ({
        country: faker.location.country(),
        description: faker.lorem.words(),
        likedByUsers: faker.helpers.arrayElements(users),
      }),
      { count: 10 },
    );

    return this.cuisineRepository.save(cuisines);
  }

  private async createIngredients(): Promise<Ingredient[]> {
    const ingredients = [
      { name: 'garlic', type: 'vegetable' },
      { name: 'spinach', type: 'vegetable' },
      { name: 'carrot', type: 'vegetable' },
      { name: 'potato', type: 'vegetable' },
      { name: 'fish', type: 'sea' },
      { name: 'shrimp', type: 'sea' },
      { name: 'chicken', type: 'bird' },
      { name: 'cheese', type: 'milk' },
      { name: 'milk', type: 'milk' },
    ];

    return this.ingredientRepository.save(ingredients);
  }

  private async createRecipies(cuisines: Cuisine[]): Promise<Recipe[]> {
    const recipes = faker.helpers.multiple(
      () => ({
        name: faker.lorem.word(),
        description: faker.lorem.text(),
        cuisines: faker.helpers.arrayElements(cuisines, { min: 1, max: 4 }),
      }),
      { count: 10 },
    );

    return this.recipeRepository.save(recipes);
  }

  private async createRecipeIngredients(
    recipes: Recipe[],
    ingredients: Ingredient[],
  ): Promise<void> {
    const ri = recipes.flatMap((recipe) => {
      const ings = faker.helpers.arrayElements(
        ingredients,
        ingredients.length / 2,
      );

      return ings.map((ingredient) => ({
        recipe,
        ingredient,
        amount: faker.number.int(100),
      }));
    });

    await this.recipeIngredientRepository.save(ri);
  }

  private async createComments(
    users: User[],
    recipes: Recipe[],
  ): Promise<void> {
    const comments = faker.helpers.multiple(
      () => ({
        text: faker.lorem.text(),
        recipe: faker.helpers.arrayElement(recipes),
        user: faker.helpers.arrayElement(users),
      }),
      { count: (recipes.length * users.length) / 2 },
    );

    await this.commentRepository.save(comments);
  }

  private async drop(): Promise<void> {
    await this.userRepository.delete({});
    await this.recipeRepository.delete({});
    await this.ingredientRepository.delete({});
    await this.cuisineRepository.delete({});
  }
}
