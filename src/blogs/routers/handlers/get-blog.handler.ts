import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { blogsReposytory } from '../../reposytories/blogs.reposytories';
import { ValidationErrorType } from '../../../core/types/validationError';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { BlogViewModel } from '../../types/blog-view-model';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model.util';


export async function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response<BlogViewModel | { errorsMessages: ValidationErrorType[] }>,
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
    const blogViewModel = mapToBlogViewModel(blog)

    res.send(blogViewModel);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError)
  }
}
