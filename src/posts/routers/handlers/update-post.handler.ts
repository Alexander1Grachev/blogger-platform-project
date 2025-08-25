import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../dto/post-input-model';
import { Post } from '../../types/post';
import { postsReposytory } from '../../reposytories/posts.reposytories';
import { ValidationErrorType } from '../../../core/types/validationError';
import { createErrorMessages } from '../../../core/utils/error.utils';

export function updatePostHandler(
  req: Request<{ id: string }, void, PostInputDto>,
  res: Response<{ errorsMessages: ValidationErrorType[] } | void>,
) {
  const id = req.params.id;
  const post = postsReposytory.findById(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ message: 'Post not found', field: 'id' }]));
    return;
  }
  postsReposytory.update(id, req.body)
  res.sendStatus(HttpStatus.NoContent);
}
