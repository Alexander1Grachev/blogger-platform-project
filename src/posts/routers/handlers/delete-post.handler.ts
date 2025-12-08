import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../application/dtos/post-input-model';
import { Post } from '../../domain/post';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { ValidationErrorType } from '../../../core/types/validationError';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function deletePostHandler(
  req: Request<{ id: string }, void>,
  res: Response<void>,
) {
  try {
    const id = req.params.id;
    await postsService.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}