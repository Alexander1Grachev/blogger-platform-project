import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorType } from '../../types/validationError';
import { ValidationErrorListOutput } from '../../types/validationError.dto';
import { HttpStatus } from '../../consts/http-statuses';

export const createErrorMessages = (
  errors: ValidationErrorType[],
): ValidationErrorListOutput => {
  return {
    errors: errors.map((error) => ({
      status: error.status,
      detail: error.detail,
      source: { pointer: error.source ?? '' },
      code: error.code ?? null,
    })),
  };
};

export const formatValidationError = (
  error: ValidationError,
): ValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;
  return {
    status: HttpStatus.BadRequest,
    source: expressError.path,
    detail: expressError.msg,
  };
};

export const inputValidationResultMiddleware = (
  req: Request<{}, {}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  console.log('🔍 inputValidationResultMiddleware - started');

  const errors = validationResult(req)
    .formatWith(formatValidationError)
    .array({ onlyFirstError: true });

  console.log('🔍 Validation errors found:', errors);
  console.log('🔍 Request body:', JSON.stringify(req.body));

  if (errors.length > 0) {
    console.log('🔍 Returning 400 with errors');
    res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
    return;
  }

  console.log('🔍 No validation errors, calling next()');
  next();
};
