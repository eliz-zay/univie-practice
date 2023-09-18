import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as entities from '@/entity';
import * as sqlModels from '@/sql-model';

import { AbstractRecipeCommentRepository } from './AbstractRecipeCommentRepository';
import { CreateCommentParams } from './types';

export class SqlRecipeCommentRepository extends AbstractRecipeCommentRepository {
  constructor(@InjectRepository(sqlModels.RecipeComment) private readonly commentRepository: Repository<sqlModels.RecipeComment>) {
    super();
  }

  public async save(params: CreateCommentParams): Promise<entities.RecipeComment> {
    return this.commentRepository.save(params);
  }
}
