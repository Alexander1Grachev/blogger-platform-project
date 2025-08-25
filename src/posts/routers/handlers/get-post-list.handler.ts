import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../dto/post-input-model';
import { Post } from '../../types/post';
import { postsReposytory } from '../../reposytories/posts.reposytories';

export function getPostListHandler(
  req: Request<{}, unknown, {}, {}>,
  res: Response<Post[]>,
) {
  const posts = postsReposytory.findAll();
  res.status(HttpStatus.Ok);
  res.send(posts)
}
