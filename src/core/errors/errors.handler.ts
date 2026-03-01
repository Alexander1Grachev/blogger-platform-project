import { Response } from 'express';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { HttpStatus } from '../consts/http-statuses';
import { createErrorMessages } from '../middlewares/validation/input-validtion-result.middleware';
import { DomainError } from './domain.error';
import { BadRequestError } from './bad-request.error';
import { UnauthorizedError } from './unauthorized.error';
import { ForbiddenError } from './forbidden.error';

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof RepositoryNotFoundError) {
    res.status(HttpStatus.NotFound).send(
      createErrorMessages([{ message: error.message, field: 'id' }])
    );
    return;
  }

  if (error instanceof DomainError) {
    res.status(HttpStatus.UnprocessableEntity).send(
      createErrorMessages([{ message: error.message, field: error.source || 'unknown' }])
    );
    return;
  }

  if (error instanceof BadRequestError) {
    res.status(HttpStatus.BadRequest).send(
      createErrorMessages([{ message: error.message, field: error.field || 'unknown' }])
    );
    return;
  }

  if (error instanceof UnauthorizedError) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  if (error instanceof ForbiddenError) {
    res.sendStatus(HttpStatus.Forbidden)
    return;
  }
  console.error(error);
  res.sendStatus(HttpStatus.InternalServerError);
  return;
}