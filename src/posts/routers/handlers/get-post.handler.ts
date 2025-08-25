import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../dto/post-input-model';
import { Post } from '../../types/post';
import { postsReposytory } from '../../reposytories/posts.reposytories';
import { ValidationErrorType } from '../../../core/types/validationError';
import { createErrorMessages } from '../../../core/utils/error.utils';

export function getPostHandler(
  req: Request<{ id: string }>,
  res: Response<Post | { errorsMessages: ValidationErrorType[] }>,
) {
  const id = req.params.id;
  const post = postsReposytory.findById(id);

  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{message: 'Post not found', field: 'id'  }]));
    return;
  }
  res.status(HttpStatus.Ok).send(post);
}
