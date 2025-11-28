import { HttpStatus } from '../consts/http-statuses';

export type ValidationErrorType = {
  status: HttpStatus;
  detail: string;
  source?: string;
  code?: string;
};
