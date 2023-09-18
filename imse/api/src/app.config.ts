import { JwtModuleOptions } from '@nestjs/jwt';
import { DataSourceOptions } from 'typeorm';
import * as path from 'path';

import * as sqlModels from '@/sql-model';

export function getPostgresDBConfig(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) ?? 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      sqlModels.User,
      sqlModels.Cuisine,
      sqlModels.RecipeComment,
      sqlModels.Recipe,
      sqlModels.Ingredient,
      sqlModels.RecipeIngredient,
      sqlModels.UserFriend
    ],
    migrations: [path.join(__dirname, 'migration', '*.{js,ts}')],
  };
}

export function getJwtModuleOptions(): JwtModuleOptions {
  return {
    secret: process.env.JWT_SECRET ?? 'secret101',
  };
}
