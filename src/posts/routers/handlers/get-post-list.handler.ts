import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostInputDto } from '../../dto/post-input-model';
import { blogsReposytory } from '../../../blogs/reposytories/blogs.reposytories';
import { postsReposytory } from '../../reposytories/posts.reposytories';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.util';

export async function getPostListHandler(
  req: Request<{}, unknown, {}, {}>,
  res: Response<PostInputDto[]>,
) {
  try {
    const posts = await postsReposytory.findAll();

    const result = []

    for (const post of posts) {
      const blog = await blogsReposytory.findById(post.blogId.toString());
      if (!blog) {
        console.warn(`Blog not found for post ${post._id}`);
        continue; // не прерываем запрос
      }

      const postWithBlog = mapToPostViewModel(post, blog);
      result.push(postWithBlog);
    }

    res.status(HttpStatus.Ok).send(result);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }

}
