import { Response } from 'express';
import { HttpStatus } from '../consts/http-statuses';
import { createErrorMessages } from '../middlewares/validation/input-validtion-result.middleware';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { DomainError } from './domain.error';

export function errorsHandler(error: unknown, res: Response): void {
  console.log('🔍 Errors handler - started with error:', error);
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound;
    console.log('🔍 Errors handler - returning 404');
    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          detail: error.message,
        },
      ]),
    );
    return;
  }

  if (error instanceof DomainError) {
    const httpStatus = HttpStatus.UnprocessableEntity;
    console.log('🔍 Errors handler - returning 422');
    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          source: error.source,
          detail: error.message,
          code: error.code,
        },
      ]),
    );
    return;
  }
  // ДОБАВИЛ ЭТУ ПРОВЕРКУ
  if (error instanceof Error && error.message.includes('validation')) {
    console.log('🔍 Errors handler - returning 400 for validation error');
    res.status(HttpStatus.BadRequest).send(
      createErrorMessages([
        {
          status: HttpStatus.BadRequest,
          detail: error.message,
        },
      ]),
    );
    return;
  }

  console.log('🔍 Errors handler - returning 500 for unknown error');
  res.status(HttpStatus.InternalServerError).send(
    createErrorMessages([
      {
        status: HttpStatus.InternalServerError,
        detail: 'Internal server error',
      },
    ]),
  );
}
