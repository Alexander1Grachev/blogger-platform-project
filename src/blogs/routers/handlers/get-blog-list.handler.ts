import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { BlogsService } from '../../application/blogs.service';
import { mapToBlogListPaginatedOutput } from '../../application/mappers/map-to-blog-list-paginated-output.util';
import { BlogQueryInput } from '../input/blog-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { injectable, inject } from "inversify";

@injectable()
export class GetBlogListController {
  constructor(@inject(BlogsService) private readonly blogsService: BlogsService) { };
  handle = async (req: Request<{}, {}, {}>,
    res: Response,
  ) => {
    try {
      const sanitizedQuery = matchedData<BlogQueryInput>(
        req,
        {
          locations: ['query'],
          includeOptionals: true,
        });

      const queryWithSearch = {
        ...sanitizedQuery,
        searchNameTerm: req.query.searchNameTerm as string || '',
      };
      const queryInput = setDefaultSortAndPaginationIfNotExist(queryWithSearch)
      const { items, totalCount } = await this.blogsService.findMany(queryInput)

      const blogListOutput = mapToBlogListPaginatedOutput(
        items, {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount
      })

      res.status(HttpStatus.Ok).send(blogListOutput)
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}