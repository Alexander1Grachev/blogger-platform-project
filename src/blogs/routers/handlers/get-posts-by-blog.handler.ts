import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { PostQueryInput } from '../../../posts/routers/input/post-query.input';
import { postsService } from '../../../posts/application/posts.service';
import { mapToPostListPaginatedOutput } from '../../../posts/routers/mappers/map-to-post-list-paginated-output.util';
import { PostListPaginatedOutput } from '../../../posts/routers/output/post-list-paginated.output';

export async function getPostsByBlogHandler(
  req: Request<{ id: string }, {}, {}>,
  res: Response<PostListPaginatedOutput>,
) {
  try {
    const blogId = req.params.id;
    const sanitizedQuery = matchedData<PostQueryInput>(
      req,
      {
        locations: ['query'],
        includeOptionals: true,
      });
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)
    const { items, totalCount } = await postsService.getPostForBlog(blogId,
      queryInput,)

    const postListOutput = mapToPostListPaginatedOutput(
      items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount
    })

    res.status(HttpStatus.Ok).send(postListOutput)
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
