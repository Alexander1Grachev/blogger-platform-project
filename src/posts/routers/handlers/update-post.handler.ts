import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostUpdateInput } from '../input/post-update.input';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function updatePostHandler(
  req: Request<{ id: string }, void, PostUpdateInput>,
  res: Response<void>,
) {
  try {
    const id = req.params.id;

    await postsService.update(id, req.body.data.attributes);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
