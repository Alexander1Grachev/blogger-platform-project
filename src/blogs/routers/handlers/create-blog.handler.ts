import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../dto/blog-input-model';
import { Blog } from '../../types/blog';
import { blogsReposytory } from '../../reposytories/blogs.reposytories';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model.util';

export async function createBlogHandler(
  req: Request<{}, {}, BlogInputDto>,// ← Хэндлер получает данные от клиента
  res: Response,
) {
  try {
    const newBlog: Blog = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    }
    const createdBlog = await blogsReposytory.create(newBlog);
    const blogViewModel = mapToBlogViewModel(createdBlog);
    res.status(HttpStatus.Created).send(blogViewModel)
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}







