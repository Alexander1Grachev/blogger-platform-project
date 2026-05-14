import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { injectable, inject } from "inversify";


@injectable()
export class DeletePostController {
  constructor(@inject(PostsService)
  private readonly postsService: PostsService) { };

  handle = async (
    req: Request<{ id: string }, void>,
    res: Response<void>,
  ) => {
    try {
      const id = req.params.id;
      await this.postsService.delete(id);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}