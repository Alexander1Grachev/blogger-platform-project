import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { PostsService } from '../../../posts/application/posts.service';
import { BlogPostInputDto } from '../../application/dtos/blog-post-input-dto';
import { mapToPostOutput } from '../../../posts/application/mappers/map-to-post-output.util';
import { injectable, inject } from "inversify";

@injectable()
export class CreatePostForBlogController {
  constructor(@inject(PostsService) private readonly postsService: PostsService) { };

  handle = async (
    req: Request<{ id: string }, {}, BlogPostInputDto>,
    res: Response,
  ) => {
    try {
      const blogId = req.params.id;
      const userId = req.user?.userId ?? null;
      const postId = await this.postsService.createPostForBlog(blogId, req.body,);
      const createdPost = await this.postsService.findById({ postId, userId });
      const postOutput = mapToPostOutput(createdPost);
      res.status(HttpStatus.Created).send(postOutput)
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}






