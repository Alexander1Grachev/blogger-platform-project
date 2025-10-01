import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../dto/blog-input-model';
import { Blog } from '../../types/blog';
import { blogsReposytory } from '../../reposytories/blogs.reposytories';
import { BlogViewModel } from '../../types/blog-view-model';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model.util';

export async function getBlogListHandler(
  req: Request<{}, unknown, {}, {}>,
  res: Response<BlogViewModel[]>,
) {
  try {
    const blogs = await blogsReposytory.findAll()
    const blogViewModel = blogs.map(mapToBlogViewModel)
    res.send(blogViewModel)   // без .status(...), по дефолту 200 вернет 
  } catch (e: unknown){
    res.sendStatus(HttpStatus.InternalServerError)
  }
}
