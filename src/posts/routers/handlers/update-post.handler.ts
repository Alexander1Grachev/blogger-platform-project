import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../dto/post-input-model';
import { postsReposytory } from '../../reposytories/posts.reposytories';
import { ValidationErrorType } from '../../../core/types/validationError';
import { createErrorMessages } from '../../../core/utils/error.utils';

export async function updatePostHandler(
  req: Request<{ id: string }, void, PostInputDto>,
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
    await postsReposytory.update(id, req.body)
    
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError)
  }
}

