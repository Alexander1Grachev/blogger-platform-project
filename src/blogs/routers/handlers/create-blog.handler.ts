import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogCreateInput } from '../input/blog-create.input';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function createBlogHandler(
  req: Request<{}, {}, BlogCreateInput>,
  res: Response,
) {
  try {
    const createBlogId = await blogsService.create(req.body.data.attributes);

    const createdBlog = await blogsService.findByIdOrFail(createBlogId);

    const blogOutput = mapToBlogOutput(createdBlog);

    res.status(HttpStatus.Created).send(blogOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
