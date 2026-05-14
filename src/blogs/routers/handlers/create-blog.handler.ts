import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../application/dtos/blog-input-dto';
import { mapToBlogOutput } from '../../application/mappers/map-to-blog-output.util';
import { BlogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { injectable, inject } from "inversify";

@injectable()
export class CreateBlogController {
  constructor(@inject(BlogsService) private readonly blogsService: BlogsService) { };
  handle = async (
    req: Request<{}, {}, BlogInputDto>,
    res: Response,
  ) => {
    try {

      const createdBlogId = await this.blogsService.create(req.body);
      const createdBlog = await this.blogsService.findByIdOrFail(createdBlogId);
      const blogOutput = mapToBlogOutput(createdBlog);
      res.status(HttpStatus.Created).send(blogOutput)
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}






