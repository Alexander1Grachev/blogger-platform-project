// адаптер между доменом и HTTP.

import { HttpStatus } from "../consts/http-statuses";
import { ResultStatus } from "./resultCode";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
  switch (resultCode) {
    case ResultStatus.BadRequest:
      return HttpStatus.BadRequest;
    case ResultStatus.Forbidden:
      return HttpStatus.Forbidden;
    default:
      return HttpStatus.InternalServerError; 
  }
};
