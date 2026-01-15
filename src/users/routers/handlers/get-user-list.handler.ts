import { Request, Response } from 'express';
import { UserQueryInput } from "../input/user-query.input";
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { usersService } from '../../application/users.service';
import { mapToUserListPaginatedOutput } from '../mappers/map-to-user-list-paginated-output.util';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getUserListHandler(
  req: Request,
  res: Response,
) {
  try {
    const sanitizedQuery = matchedData<UserQueryInput>(
      req,
      {
        locations: ['query'],
        includeOptionals: true,
      });
    const queryWithSearch = {
      ...sanitizedQuery,
      searchLoginTerm: req.query.searchLoginTerm as string || '',
      searchEmailTerm: req.query.searchEmailTerm as string || '',
    };
    const queryInput = setDefaultSortAndPaginationIfNotExist(queryWithSearch);
    const { items, totalCount } = await usersService.findMany(queryInput);
    const userListOutput = mapToUserListPaginatedOutput(
      items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.status(HttpStatus.Ok).send(userListOutput)
  } catch (e: unknown) {
    errorsHandler(e, res)
  }
}