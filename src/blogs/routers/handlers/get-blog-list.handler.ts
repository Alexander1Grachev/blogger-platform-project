import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../dto/blog-input-model';
import { Blog } from '../../types/blog';
import { blogsReposytory } from '../../reposytories/blogs.reposytories';
import { ValidationErrorType } from '../../../core/types/validationError';

export function getBlogListHandler(
  req: Request<{}, unknown, {}, {}>,
  res: Response<Blog[]>,
) {
const blogs = blogsReposytory.findAll()
res.send(blogs)   // без .status(...), по дефолту 200 вернет 
}
