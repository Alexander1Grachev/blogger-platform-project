import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { postInputDtoValidation } from '../validation/post.input-dto.validation';

import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { PostSortField } from './input/post-sort-field';
import { CommentSortField } from '../../comments/routers/input/comment-sort-field';
import { COMMENT_PATH } from '../../core/paths/paths';
import { accessTokenGuard } from '../../auth/middlewares/access.token.guard';
import { CommentInputDtoValidation } from '../../comments/validation/comment.input-dto.validation';


import {
  createCommentController,
  createPostController,
  deletePostController,
  getPostCommentsController,
  getPostListController,
  getPostController,
  updatePostHController,
} from "../../composition-root";
export const postsRouter = Router();

postsRouter
  .get('/:id', idValidation, inputValidationResultMiddleware, getPostController.handle)
  .get(
    '/',
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getPostListController.handle,
  )
  .get(`/:id${COMMENT_PATH}`,
    idValidation,
    paginationAndSortingValidation(CommentSortField),
    inputValidationResultMiddleware,
    getPostCommentsController.handle)


  //guardedPostsRouter
  .post(
    '/',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostController.handle,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostHController.handle,
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostController.handle,
  )
  .post(
    `/:id${COMMENT_PATH}`,
    accessTokenGuard,
    idValidation,
    CommentInputDtoValidation,
    inputValidationResultMiddleware,
    createCommentController.handle
  )