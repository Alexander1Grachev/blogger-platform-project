import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { mapToPostOutput } from '../../application/mappers/map-to-post-output.util';
import { PostsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { injectable, inject } from "inversify";


@injectable()
export class GetPostController {
  constructor(@inject(PostsService) private readonly postsService: PostsService) { };

  handle = async (
    req: Request<{ id: string }>,
    res: Response,
  ) => {
    try {
      const id = req.params.id;
      const post = await this.postsService.findByIdOrFail(id);
      const postOutput = mapToPostOutput(post)
      res.status(HttpStatus.Ok).send(postOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}