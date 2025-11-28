import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { PostCreateInput } from '../../../posts/routers/input/post-create.input';
import { postsService } from '../../../posts/application/posts.service';
import { mapToPostOutput } from '../../../posts/routers/mappers/map-to-post-output.util';
import { HttpStatus } from '../../../core/consts/http-statuses';

export async function createPostForBlogHandler(
  req: Request<{ id: string }, {}, PostCreateInput, {}>,
  res: Response,
) {
  try {
    const blogId = req.params.id;
    const createdPostId = await postsService.createPostForBlog(
      req.body.data.attributes,
      blogId,
    );
    const createdPost = await postsService.findByIdOrFail(createdPostId);

    const postOutput = mapToPostOutput(createdPost);
    res.status(HttpStatus.Created).send(postOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
