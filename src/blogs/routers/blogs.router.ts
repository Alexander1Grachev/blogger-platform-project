import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

import { idValidation } from '../../core/middlewares/validation/params-id-validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { blogInputDtoValidation } from '../validation/blog.input-dto.validation';
import { blogPostInputDtoValidation } from '../../posts/validation/post.input-dto.validation';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting-validation.middleware';
import { PostSortField } from '../../posts/routers/input/post-sort-field';
import { BlogSortField } from './input/blog-sort-field';
import { CreateBlogController } from './handlers/create-blog.handler';
import { CreatePostForBlogController } from './handlers/create-post.blog.handler';
import { DeleteBlogController } from './handlers/delete-blog.handler';
import { GetBlogListController } from './handlers/get-blog-list.handler';
import { GetBlogController } from './handlers/get-blog.handler';
import { GetPostsByBlogController } from './handlers/get-posts-by-blog.handler';
import { UpdateBlogController } from './handlers/update-blog.handler';

import { container } from "../../composition-root";
import { likeStatusMiddleware } from '../../core/middlewares/like-status.middleware';


export const blogsRouter = Router();

// Публичные
blogsRouter
  .get('/:id', idValidation, inputValidationResultMiddleware, container.get(GetBlogController).handle)
  .get(
    '/',
    paginationAndSortingValidation(BlogSortField),
    inputValidationResultMiddleware,
    container.get(GetBlogListController).handle,
  )
  .get(
    '/:id/posts',
    likeStatusMiddleware,
    idValidation,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    container.get(GetPostsByBlogController).handle,
  )
  // Авторизация
  .post(
    '/',
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    container.get(CreateBlogController).handle,
  )
  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    idValidation,
    blogPostInputDtoValidation,
    inputValidationResultMiddleware,
    container.get(CreatePostForBlogController).handle,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    container.get(UpdateBlogController).handle,
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    container.get(DeleteBlogController).handle,
  );