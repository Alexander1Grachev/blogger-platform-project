import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { BlogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { injectable, inject } from "inversify";

@injectable()
export class DeleteBlogController {
  constructor(@inject(BlogsService) private readonly blogsService: BlogsService) { };

  handle = async (
    req: Request<{ id: string }, void>,
    res: Response,
  ) => {
    try {
      const blogId = req.params.id;
      await this.blogsService.delete(blogId);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}