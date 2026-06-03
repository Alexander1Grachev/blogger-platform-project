import { Router } from 'express';

import { idValidation } from '../../core/middlewares/validation/params-id-validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { accessTokenGuardMiddleware } from '../../auth/middlewares/access.token.guard';

import { CommentInputDtoValidation } from '../validation/comment.input-dto.validation';

import { DeleteCommentController } from './handlers/delete-comment.handler';
import { UpdateCommentController } from './handlers/update-comment.handler';
import { GetCommentController } from './handlers/get-comment.handler';

import { container } from "../../composition-root";
import { likeStatusMiddleware } from '../../core/middlewares/like-status.middleware';
import { likeStatusValidation } from '../../core/middlewares/validation/input-like-status-validtion.middleware';
import { UpdateCommentLikeStatusController } from './handlers/update-comment-like-status.handler';



export const commentsRouter = Router();

commentsRouter
  .get('/:id',
    likeStatusMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    container.get(GetCommentController).handle,
  )

  .put('/:id',
    accessTokenGuardMiddleware,
    idValidation,
    CommentInputDtoValidation,
    inputValidationResultMiddleware,
    container.get(UpdateCommentController).handle,
  )

  .delete('/:id',
    accessTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    container.get(DeleteCommentController).handle,
  )
  .put('/:id/like-status',
    likeStatusMiddleware,
    idValidation,
    likeStatusValidation,
    inputValidationResultMiddleware,
    container.get(UpdateCommentLikeStatusController).handle,
  )


