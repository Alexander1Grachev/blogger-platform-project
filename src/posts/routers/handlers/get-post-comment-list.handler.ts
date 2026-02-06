import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { commentsService } from '../../../comments/application/comments.service';
import { matchedData } from 'express-validator';
import { CommentQueryInput } from '../../../comments/routers/input/comment-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { mapToCommentListPaginatedOutput } from '../../../comments/application/mappers/map-to-comment-list-paginated-output.util';

export async function getPostCommentsHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {

    const postId = req.params.id;

    const sanitizedQuery = matchedData<CommentQueryInput>(
      req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
    const { items, totalCount } = await commentsService.findManyPostComments(postId, queryInput)
    const commentOutput = mapToCommentListPaginatedOutput(
      items,
      {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount
      }
    )

    return res.status(HttpStatus.Ok).send(commentOutput)
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}