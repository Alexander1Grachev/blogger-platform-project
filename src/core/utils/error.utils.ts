import { ValidationErrorType } from '../types/validationError';
import { ValidationErrorDto } from '../types/validationError.dto';

export const createErrorMessages = (
  errors: ValidationErrorType[],
): ValidationErrorDto => {
  return { errorsMessages: errors };
};
