import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../dto/post-input-model';
import { Post } from '../../types/post';
import { postsReposytory } from '../../reposytories/posts.reposytories';
import { db } from '../../../db/in-memory.db';

export function createPostHandler(
  req: Request<{}, {}, PostInputDto>,
  res: Response,
) {
  const blog = db.blogs.find((b) => b.id === req.body.blogId);
  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send({ message: 'Blog not found', field: 'id' });
    return;
  }
  const newPost: Post = {
    id: db.blogs.length
      ? String(Number(db.blogs[db.blogs.length - 1].id) + 1)
      : '1',
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName: blog.name,
  };
  postsReposytory.create(newPost);
  res.status(HttpStatus.Created).send(newPost);
}
