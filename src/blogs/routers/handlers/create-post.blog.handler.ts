import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../posts/application/posts.service';
import { BlogPostInputDto } from '../../application/dtos/blog-post-input-model';
import { mapToPostOutput } from '../../../posts/routers/mappers/map-to-post-output.util';

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







