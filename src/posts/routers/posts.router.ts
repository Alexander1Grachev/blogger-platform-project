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
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { PostSortField } from './input/post-sort-field';
import { getPostCommentsHandler } from './handlers/get-post-comment-list.handler';
import { CommentSortField } from '../../comments/routers/input/comment-sort-field';
import { COMMENT_PATH } from '../../core/paths/paths';
import { accessTokenGuard } from '../../auth/middlewares/access.token.guard';
import { CommentInputDtoValidation } from '../../comments/validation/comment.input-dto.validation';
import { createCommentHandler } from './handlers/create-comment.handler';

export const postsRouter = Router();

postsRouter
  .get('/:id', idValidation, inputValidationResultMiddleware, getPostHandler)
  .get(
    '/',
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getPostListHandler,
  )
  .get(`/:id${COMMENT_PATH}`,
    idValidation,
    paginationAndSortingValidation(CommentSortField),
    inputValidationResultMiddleware,
    getPostCommentsHandler)


  //guardedPostsRouter
  .post(
    '/',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  )
  .post(
    `/:id${COMMENT_PATH}`,
    accessTokenGuard,
    idValidation,
    CommentInputDtoValidation,
    inputValidationResultMiddleware,
    createCommentHandler
  )