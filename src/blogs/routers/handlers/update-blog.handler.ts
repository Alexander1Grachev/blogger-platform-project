import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../dto/blog-input-model';
import { Blog } from '../../types/blog';
import { blogsReposytory } from '../../reposytories/blogs.reposytories';
import { ValidationErrorType } from '../../../core/types/validationError';
import { createErrorMessages } from '../../../core/utils/error.utils';

export function updateBlogHandler(
  req: Request<{ id: string }, void, BlogInputDto>,
  res: Response<{ errorsMessages: ValidationErrorType[] } | void>,
) {
  const id = req.params.id;
  const blog = blogsReposytory.findById(id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ message: 'Post not found', field: 'id' }]));
    return;
  }

  blogsReposytory.update(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
}
