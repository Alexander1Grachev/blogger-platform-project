import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../application/dtos/blog-input-model';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function createBlogHandler(
  req: Request<{}, {}, BlogInputDto>,
  res: Response,
) {
  try {

    const createdBlogId = await blogsService.create(req.body);
    const createdBlog = await blogsService.findByIdOrFail(createdBlogId);
    const blogOutput = mapToBlogOutput(createdBlog);
    res.status(HttpStatus.Created).send(blogOutput)
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}







