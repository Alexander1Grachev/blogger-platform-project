import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostCreateInput } from '../input/post-create.input';

import { mapToPostOutput } from '../mappers/map-to-post-output.util';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function createPostHandler(
  req: Request<{}, {}, PostCreateInput>,
  res: Response,
) {
  try {
    const createdPostId = await postsService.create(req.body.data.attributes);
    const createdPost = await postsService.findByIdOrFail(createdPostId);

    const postOutput = mapToPostOutput(createdPost);

    res.status(HttpStatus.Created).send(postOutput);
  } catch (e: unknown) {
    console.log(e);
    errorsHandler(e, res);
  }
}
