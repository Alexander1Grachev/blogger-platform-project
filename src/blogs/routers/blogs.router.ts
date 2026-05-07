import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { blogInputDtoValidation } from '../validation/blog.input-dto.validation';
import { blogPostInputDtoValidation } from '../../posts/validation/post.input-dto.validation';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { PostSortField } from '../../posts/routers/input/post-sort-field';
import { BlogSortField } from './input/blog-sort-field';


import {
  createBlogController,
  createPostForBlogController,
  deleteBlogController,
  getBlogListController,
  getBlogController,
  getPostsByBlogController,
  updateBlogController,
} from "../../composition-root";


export const blogsRouter = Router();

// Публичные
blogsRouter
  .get('/:id', idValidation, inputValidationResultMiddleware, getBlogController.handle)
  .get(
    '/',
    paginationAndSortingValidation(BlogSortField),
    inputValidationResultMiddleware,
    getBlogListController.handle,

  )
  .get(
    '/:id/posts',
    idValidation,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getPostsByBlogController.handle,
  )
  // Авторизация
  .post(
    '/',
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogController.handle,
  )
  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    idValidation,
    blogPostInputDtoValidation,
    inputValidationResultMiddleware,
    createPostForBlogController.handle,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    updateBlogController.handle,
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogController.handle,
  );