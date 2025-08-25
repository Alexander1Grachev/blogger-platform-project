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

export const blogsRouter = Router();

blogsRouter.get(
  '/:id',
  idValidation,
  inputValidationResultMiddleware,
  getBlogHandler,
);
blogsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  idValidation,
  blogInputDtoValidation,
  inputValidationResultMiddleware,
  updateBlogHandler,
);
blogsRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idValidation,
  inputValidationResultMiddleware,
  deleteBlogHandler,
);

blogsRouter.get('/', getBlogListHandler);
blogsRouter.post(
  '/',
  superAdminGuardMiddleware,
  blogInputDtoValidation,
  inputValidationResultMiddleware,
  createBlogHandler,
);
