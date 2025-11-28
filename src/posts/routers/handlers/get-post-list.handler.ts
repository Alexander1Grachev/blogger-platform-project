import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { PostQueryInput } from '../input/post-query.input';
import { postsService } from '../../application/posts.service';
import { mapToPostListPaginatedOutput } from '../mappers/map-to-post-list-paginated-output.util';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';

export async function getPostListHandler(
  req: Request<{}, {}, {}, PostQueryInput>,
  res: Response,
) {
  try {
    const sanitizedQuery = matchedData<PostQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await postsService.findMany(queryInput);

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.status(HttpStatus.Ok).send(postListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
