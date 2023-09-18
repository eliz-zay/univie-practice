import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getJwtModuleOptions, getPostgresDBConfig } from './app.config';
import { JwtStrategy } from './jwt.strategy';

import * as infrastructure from '@/infrastructure';
import * as sqlModel from '@/sql-model';
import * as repositories from '@/repository';
import * as service from '@/service';
import * as controller from '@/controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(getPostgresDBConfig()),
    TypeOrmModule.forFeature([
      sqlModel.RecipeComment,
      sqlModel.Cuisine,
      sqlModel.Ingredient,
      sqlModel.Recipe,
      sqlModel.RecipeIngredient,
      sqlModel.User,
      sqlModel.UserFriend,
    ]),
    JwtModule.register(getJwtModuleOptions()),
  ],
  providers: [
    JwtStrategy,
    // SQL repositories
    repositories.SqlCuisineRepository,
    repositories.SqlUserFriendRepository,
    repositories.SqlIngredientRepository,
    repositories.SqlRecipeCommentRepository,
    repositories.SqlRecipeRepository,
    repositories.SqlUserRepository,
    // NoSQL repositories
    repositories.NoSqlCuisineRepository,
    repositories.NoSqlUserFriendRepository,
    repositories.NoSqlIngredientRepository,
    repositories.NoSqlRecipeCommentRepository,
    repositories.NoSqlRecipeRepository,
    repositories.NoSqlUserRepository,
    // Storage-dependent repositories
    infrastructure.proxyRepositoryProvider<repositories.AbstractCuisineRepository>(
      repositories.SqlCuisineRepository, repositories.NoSqlCuisineRepository
    ),
    infrastructure.proxyRepositoryProvider<repositories.AbstractUserFriendRepository>(
      repositories.SqlUserFriendRepository, repositories.NoSqlUserFriendRepository
    ),
    infrastructure.proxyRepositoryProvider<repositories.AbstractIngredientRepository>(
      repositories.SqlIngredientRepository, repositories.NoSqlIngredientRepository
    ),
    infrastructure.proxyRepositoryProvider<repositories.AbstractRecipeCommentRepository>(
      repositories.SqlRecipeCommentRepository, repositories.NoSqlRecipeCommentRepository
    ),
    infrastructure.proxyRepositoryProvider<repositories.AbstractRecipeRepository>(
      repositories.SqlRecipeRepository, repositories.NoSqlRecipeRepository
    ),
    infrastructure.proxyRepositoryProvider<repositories.AbstractUserRepository>(
      repositories.SqlUserRepository, repositories.NoSqlUserRepository
    ),
    // Services
    service.RecipeService,
    service.CommentService,
    service.CuisineService,
    service.IngredientService,
    service.SeedService,
    service.UserFriendService,
    service.UserService,
    service.MigrationService
  ],
  controllers: [
    controller.CommentController,
    controller.CuisineController,
    controller.IngredientController,
    controller.RecipeController,
    controller.SeedController,
    controller.UserController,
    controller.UserFriendController,
    controller.MigrationController
  ],
})
export class AppModule { }
