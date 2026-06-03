import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

import { idValidation } from '../../core/middlewares/validation/params-id-validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { postInputDtoValidation } from '../validation/post.input-dto.validation';

import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting-validation.middleware';
import { PostSortField } from './input/post-sort-field';
import { CommentSortField } from '../../comments/routers/input/comment-sort-field';
import { COMMENT_PATH } from '../../core/paths/paths';
import { accessTokenGuardMiddleware } from '../../auth/middlewares/access.token.guard';
import { CommentInputDtoValidation } from '../../comments/validation/comment.input-dto.validation';

import { CreateCommentController } from './handlers/create-comment.handler';
import { CreatePostController } from './handlers/create-post.handler';
import { DeletePostController } from './handlers/delete-post.handler';
import { GetPostCommentsController } from './handlers/get-post-comment-list.handler';
import { GetPostListController } from './handlers/get-post-list.handler';
import { GetPostController } from './handlers/get-post.handler';
import { UpdatePostHController } from './handlers/update-post.handler';
import { container } from "../../composition-root";
import { likeStatusMiddleware } from '../../core/middlewares/like-status.middleware';


export const postsRouter = Router();

postsRouter
  .get('/:id', idValidation, inputValidationResultMiddleware, container.get(GetPostController).handle)
  .get(
    '/',
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    container.get(GetPostListController).handle,
  )
  .get(`/:id${COMMENT_PATH}`,
    likeStatusMiddleware,
    idValidation,
    paginationAndSortingValidation(CommentSortField),
    inputValidationResultMiddleware,
    container.get(GetPostCommentsController).handle)


  //guardedPostsRouter
  .post(
    '/',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    container.get(CreatePostController).handle,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    container.get(UpdatePostHController).handle,
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    container.get(DeletePostController).handle,
  )
  .post(
    `/:id${COMMENT_PATH}`,
    accessTokenGuardMiddleware,
    idValidation,
    CommentInputDtoValidation,
    inputValidationResultMiddleware,
    container.get(CreateCommentController).handle
  )