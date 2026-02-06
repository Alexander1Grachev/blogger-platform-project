import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function deletePostHandler(
  req: Request<{ id: string }, void>,
  res: Response<void>,
) {
  try {
    const id = req.params.id;
    await postsService.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}