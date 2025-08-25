import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { postInputDtoValidation } from '../validation/post.input-dto.validation';

import { updatePostHandler } from './handlers/update-post.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { createPostHandler } from './handlers/create-post.handler';

export const postsRouter = Router();
postsRouter.get(
  '/:id',
  idValidation,
  inputValidationResultMiddleware,
  getPostHandler,
);
postsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  idValidation,
  postInputDtoValidation,
  inputValidationResultMiddleware,
  updatePostHandler,
);
postsRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idValidation,
  inputValidationResultMiddleware,
  deletePostHandler,
);

postsRouter.get('/', getPostListHandler);
postsRouter.post(
  '/',
  superAdminGuardMiddleware,
  postInputDtoValidation,
  inputValidationResultMiddleware,
  createPostHandler,
);
