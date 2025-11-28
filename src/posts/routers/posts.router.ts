import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import {
  postCreateInputValidation,
  postUpdateInputValidation,
} from '../validation/post.input-dto.validation';

import { updatePostHandler } from './handlers/update-post.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { PostSortField } from '../../core/consts/post-sort-field';

export const postsRouter = Router();

postsRouter
  .get('/:id', idValidation, inputValidationResultMiddleware, getPostHandler)
  .get(
    '/',
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getPostListHandler,
  )

  //guardedPostsRouter
  .post(
    '/',
    superAdminGuardMiddleware,
    postCreateInputValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    postUpdateInputValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  );
