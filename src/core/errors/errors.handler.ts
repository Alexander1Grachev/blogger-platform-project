import { Response } from 'express';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { HttpStatus } from '../consts/http-statuses';
import { createErrorMessages } from '../middlewares/validation/input-validtion-result.middleware';
import { DomainError } from './domain.error';

export function errorsHandler(error: unknown, res: Response): void {

  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound;
    res.status(httpStatus).send(
      createErrorMessages([
        {
          message: error.message,
          field: 'id',
        },
      ]),
    );

    return;
  }
  if (error instanceof DomainError) {
    const httpStatus = HttpStatus.UnprocessableEntity;
    res.status(httpStatus).send(
      createErrorMessages([
        {
          message: error.message,
          field: error.source || 'unknown',
        },
      ]),
    );

    return;
  }
  res.status(HttpStatus.InternalServerError);
  return;
}