import { Request, Response } from 'express';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { BlogOutput } from '../output/blog.output';

export async function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response<BlogOutput>,
) {
  try {
    const id = req.params.id;
    const blog = await blogsService.findByIdOrFail(id);

    const blogOutput = mapToBlogOutput(blog);

    res.send(blogOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
