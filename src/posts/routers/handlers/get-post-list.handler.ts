import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { PostQueryInput } from '../input/post-query.input';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { PostsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPostListPaginatedOutput } from '../../application/mappers/map-to-post-list-paginated-output.util';

export class GetPostListController {
  constructor(private readonly postsService: PostsService) { };

  handle = async (
    req: Request<{}, unknown, {}>,
    res: Response,
  ) => {
    try {
      const sanitizedQuery = matchedData<PostQueryInput>(
        req, {
        locations: ['query'],
        includeOptionals: true,
      });

      const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
      const { items, totalCount } = await this.postsService.findMany(queryInput);
      const postsOutput = mapToPostListPaginatedOutput(items, {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount
      })
      res.status(HttpStatus.Ok).send(postsOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }

  }
}