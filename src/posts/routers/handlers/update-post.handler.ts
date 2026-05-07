import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../application/dtos/post-input-dto';
import { ValidationErrorType } from '../../../core/types/validationError';
import { PostsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export class UpdatePostHController {
  constructor(private readonly postsService: PostsService) { };

  handle = async (
    req: Request<{ id: string }, void, PostInputDto>,
    res: Response<{ errorsMessages: ValidationErrorType[] } | void>,
  ) => {
    try {
      const id = req.params.id;
      await this.postsService.update(id, req.body)

      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
