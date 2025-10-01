import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../dto/post-input-model';
import { Post } from '../../types/post';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { postsReposytory } from '../../reposytories/posts.reposytories';
import { ValidationErrorType } from '../../../core/types/validationError';

export async function deletePostHandler(
  req: Request<{ id: string }, void>,
  res: Response<{ errorsMessages: ValidationErrorType[] } | void>,
) {
  try {
    const id = req.params.id;
    const post = await postsReposytory.findById(id);
    if (!post) {
      res
        .status(HttpStatus.NotFound)
        .send(createErrorMessages([{ message: 'Post not found', field: 'id' }]));
      return;
    }
    await postsReposytory.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError)
  }
}