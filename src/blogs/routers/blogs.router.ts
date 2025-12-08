import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { blogInputDtoValidation } from '../validation/blog.input-dto.validation';

import { updateBlogHandler } from './handlers/update-blog.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { blogPostInputDtoValidation, postInputDtoValidation } from '../../posts/validation/post.input-dto.validation';
import { createPostForBlogHandler } from './handlers/create-post.blog.handler';
import { getPostsByBlogHandler } from './handlers/get-posts-by-blog.handler';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { PostSortField } from '../../posts/routers/input/post-sort-field';
import { BlogSortField } from './input/blog-sort-field';

export const blogsRouter = Router();

// Публичные
blogsRouter
  .get('/:id', idValidation, inputValidationResultMiddleware, getBlogHandler)
  .get(
    '/',
    paginationAndSortingValidation(BlogSortField),
    inputValidationResultMiddleware,
    getBlogListHandler,
    
  )
  .get(
    '/:id/posts',
    idValidation,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getPostsByBlogHandler,
  )
  // Авторизация
  .post(
    '/',
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )
  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    idValidation,
    blogPostInputDtoValidation,
    inputValidationResultMiddleware,
    createPostForBlogHandler,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  );