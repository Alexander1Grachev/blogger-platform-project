import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../dto/post-input-model';
import { postsReposytory } from '../../reposytories/posts.reposytories';
import { ValidationErrorType } from '../../../core/types/validationError';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.util';
import { blogsReposytory } from '../../../blogs/reposytories/blogs.reposytories';

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response<PostInputDto | { errorsMessages: ValidationErrorType[] }>,
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

    const blog = await blogsReposytory.findById(post.blogId.toString())
    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(createErrorMessages([{ message: 'Blog not found', field: 'blogId' }]));
      return

    }

    const postViewModel = mapToPostViewModel(post, blog)
    res.status(HttpStatus.Ok).send(postViewModel);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError)
  }
}
