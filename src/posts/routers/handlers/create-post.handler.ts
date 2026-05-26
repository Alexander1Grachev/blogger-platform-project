import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../application/dtos/post-input-dto';
import { PostsService } from '../../application/posts.service';
import { mapToPostOutput } from '../../application/mappers/map-to-post-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { injectable, inject } from "inversify";


@injectable()
export class CreatePostController {
  constructor(@inject(PostsService) private readonly postsService: PostsService) { };

  handle = async (
    req: Request<{}, {}, PostInputDto>,
    res: Response,
  ) => {
    try {

      const createdPostId = await this.postsService.create(req.body);
      const createdPost = await this.postsService.findById(createdPostId);

      const postOutput = mapToPostOutput(createdPost);
      res.status(HttpStatus.Created).send(postOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}