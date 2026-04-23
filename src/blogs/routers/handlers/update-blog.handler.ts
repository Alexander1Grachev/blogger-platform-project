import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../application/dtos/blog-input-dto';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function updateBlogHandler(
  req: Request<{ id: string }, void, BlogInputDto>,
  res: Response<void>,
) {
  try {
    const id = req.params.id;

    await blogsService.update(id, req.body);

    res.sendStatus(HttpStatus.NoContent)
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
