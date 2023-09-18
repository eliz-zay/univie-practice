import { Inject, Injectable, forwardRef } from '@nestjs/common';

import * as infrastructure from '@/infrastructure';
import * as entities from '@/entity';
import * as repositories from '@/repository';
import * as services from '@/service';

import * as types from '@/service/CommentService.types';

@Injectable()
export class CommentService {
  constructor(
    @infrastructure.InjectRepository(entities.RecipeComment) private readonly commentRepository: repositories.AbstractRecipeCommentRepository,
    @Inject(forwardRef(() => services.RecipeService)) private readonly recipeService: services.RecipeService,
  ) { }

  async createComment(params: types.CreateCommentParams): Promise<entities.RecipeComment> {
    const { text, recipeId, user } = params;

    const recipe = await this.recipeService.getRecipe(recipeId);

    return this.commentRepository.save({ user, text, recipe });
  }
}
