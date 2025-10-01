import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../dto/post-input-model';
import { Post } from '../../types/post';
import { ObjectId } from 'mongodb';

import { postsReposytory } from '../../reposytories/posts.reposytories';
import { blogsReposytory } from '../../../blogs/reposytories/blogs.reposytories';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.util';

export async function createPostHandler(
  req: Request<{}, {}, PostInputDto>,
  res: Response,
) {
  try {
    const blogId = req.body.blogId;
    const blog = await blogsReposytory.findById(blogId);
    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send({ message: 'Blog not found', field: 'id' });
      return;
    }
    const newPost: Post = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: new ObjectId(blogId), // ← Конвертируем в ObjectId!
      createdAt: new Date(), 
    };
    const createdPost = await postsReposytory.create(newPost);
    const postViewModel = mapToPostViewModel(createdPost, blog);
    res.status(HttpStatus.Created).send(postViewModel);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
