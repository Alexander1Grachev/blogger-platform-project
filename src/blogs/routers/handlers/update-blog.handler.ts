import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { BlogUpdateInput } from '../input/blog-update.input';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function updateBlogHandler(
  req: Request<{ id: string }, void, BlogUpdateInput>,
  res: Response<void>,
) {
  try {
    const id = req.params.id;
    await blogsService.update(id, req.body.data.attributes);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
