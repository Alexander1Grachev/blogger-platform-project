import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../application/dtos/post-input-model';
import { postsService } from '../../application/posts.service';
import { mapToPostOutput } from '../../application/mappers/map-to-post-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function createPostHandler(
  req: Request<{}, {}, PostInputDto>,
  res: Response,
) {
  try {

    const createdPostId = await postsService.create(req.body);
    const createdPost = await postsService.findByIdOrFail(createdPostId);

    const postOutput = mapToPostOutput(createdPost);
    res.status(HttpStatus.Created).send(postOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
