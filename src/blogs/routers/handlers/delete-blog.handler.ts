import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function deleteBlogHandler(
  req: Request<{ id: string }, void>,
  res: Response,
) {
  try {
    const blogId = req.params.id;
    await blogsService.delete(blogId);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

