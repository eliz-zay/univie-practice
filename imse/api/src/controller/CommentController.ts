import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoggedInRequest } from '@/jwt.strategy';
import * as services from '@/service';
import * as entities from '@/entity';
import * as types from './CommentController.types';

@UseGuards(AuthGuard('jwt'))
@Controller('comment')
export class CommentController {
  constructor(private commentService: services.CommentService) { }

  @Post('recipe/:recipeId')
  async createComment(
    @Req() req: LoggedInRequest,
    @Param('recipeId') recipeId: string,
    @Body() params: types.CreateCommentParams
  ): Promise<entities.RecipeComment> {
    return this.commentService.createComment({ user: req.user, recipeId, text: params.text });
  }
}
