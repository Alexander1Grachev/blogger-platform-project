import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { mapToPostOutput } from '../../application/mappers/map-to-post-output.util';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const post = await postsService.findByIdOrFail(id);
    const postOutput = mapToPostOutput(post)
    res.status(HttpStatus.Ok).send(postOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
