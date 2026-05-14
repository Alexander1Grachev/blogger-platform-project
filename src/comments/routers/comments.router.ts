import { Router } from 'express';

import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { accessTokenGuardMiddleware } from '../../auth/middlewares/access.token.guard';

import { CommentInputDtoValidation } from '../validation/comment.input-dto.validation';

import { DeleteCommentController } from './handlers/delete-comment.handler';
import { UpdateCommentController } from './handlers/update-comment.handler';
import { GetCommentController } from './handlers/get-comment.handler';

import { container } from "../../composition-root";



export const commentsRouter = Router();

commentsRouter
  .get('/:id',
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