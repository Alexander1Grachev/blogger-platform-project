import { Router } from 'express';

import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { accessTokenGuard } from '../../auth/middlewares/access.token.guard';
import { getCommentHandler } from './handlers/get-comment.handler';
import { updateCommentHandler } from './handlers/update-comment.handler';
import { deleteCommentHandler } from './handlers/delete-comment.handler';
import { CommentInputDtoValidation } from '../validation/comment.input-dto.validation';




export const commentsRouter = Router();

commentsRouter
  .get('/:id',
    idValidation,
    inputValidationResultMiddleware,
    getCommentHandler,
  )

  .put('/:id',
    accessTokenGuard,
    idValidation,
    CommentInputDtoValidation,
    inputValidationResultMiddleware,
    updateCommentHandler,
  )

  .delete('/:id',
    accessTokenGuard,
    idValidation,
    inputValidationResultMiddleware,
    deleteCommentHandler,
  )