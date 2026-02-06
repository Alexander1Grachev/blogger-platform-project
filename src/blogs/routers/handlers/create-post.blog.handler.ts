import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../posts/application/posts.service';
import { BlogPostInputDto } from '../../application/dtos/blog-post-input-model';
import { mapToPostOutput } from '../../../posts/application/mappers/map-to-post-output.util';

export async function createPostForBlogHandler(
  req: Request<{ id: string }, {}, BlogPostInputDto>,
  res: Response,
) {
  try {
    const blogId = req.params.id
    const createdPostId = await postsService.createPostForBlog(blogId, req.body,);
    const createdPost= await postsService.findByIdOrFail(createdPostId);
    const postOutput = mapToPostOutput(createdPost);
    res.status(HttpStatus.Created).send(postOutput)
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}







