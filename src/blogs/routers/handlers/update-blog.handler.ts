import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../dto/blog-input-model';
import { blogsReposytory } from '../../reposytories/blogs.reposytories';
import { ValidationErrorType } from '../../../core/types/validationError';
import { createErrorMessages } from '../../../core/utils/error.utils';

export async function updateBlogHandler(
  req: Request<{ id: string }, void, BlogInputDto>,
  res: Response<{ errorsMessages: ValidationErrorType[] } | void>,
) {
  try {
    const id = req.params.id;
    const blog = await blogsReposytory.findById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(createErrorMessages([{ message: 'Post not found', field: 'id' }]));
      return;
    }
    await blogsReposytory.update(id, req.body);

    res.sendStatus(HttpStatus.NoContent)
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError)
  }
}
