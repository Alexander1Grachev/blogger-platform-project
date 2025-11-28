import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import {
  blogUpdateInputValidation,
  blogCreateInputValidation,
} from '../validation/blog.input-dto.validation';

import { updateBlogHandler } from './handlers/update-blog.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { getPostForBlogHandler } from './handlers/get-post-for-blog.handler';
import { PostSortField } from '../../core/consts/post-sort-field';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { BlogSortField } from '../../core/consts/blog-sort-field';
import { createPostForBlogHandler } from './handlers/create-post-for-blog.handler';
import { postCreateInputValidation } from '../../posts/validation/post.input-dto.validation';

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
    getPostForBlogHandler,
  )
  // Авторизация
  .post(
    '/',
    superAdminGuardMiddleware,
    blogCreateInputValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )
  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    idValidation,
    postCreateInputValidation,
    inputValidationResultMiddleware,
    createPostForBlogHandler,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    blogUpdateInputValidation,
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
