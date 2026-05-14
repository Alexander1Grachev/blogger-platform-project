import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogInputDto } from '../../application/dtos/blog-input-dto';
import { BlogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { injectable, inject } from "inversify";

@injectable()
export class UpdateBlogController {
  constructor(@inject(BlogsService) private readonly blogsService: BlogsService) { };
  handle = async (
    req: Request<{ id: string }, void, BlogInputDto>,
    res: Response<void>,
  ) => {
    try {
      const id = req.params.id;

      await this.blogsService.update(id, req.body);

      res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}