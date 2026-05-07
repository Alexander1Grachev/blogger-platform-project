import { Router } from 'express';

import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { accessTokenGuard } from '../../auth/middlewares/access.token.guard';

import { CommentInputDtoValidation } from '../validation/comment.input-dto.validation';


import {
  deleteCommentController,
  updateCommentController,
  getCommentController,
} from "../../composition-root";

export const commentsRouter = Router();

commentsRouter
  .get('/:id',
    idValidation,
    inputValidationResultMiddleware,
    getCommentController.handle,
  )

  .put('/:id',
    accessTokenGuard,
    idValidation,
    CommentInputDtoValidation,
    inputValidationResultMiddleware,
    updateCommentController.handle,
  )

  .delete('/:id',
    accessTokenGuard,
    idValidation,
    inputValidationResultMiddleware,
    deleteCommentController.handle,
  )