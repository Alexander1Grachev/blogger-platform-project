//просто TypeScript-тип, который описывает 
// форму JSON-ответа с ошибками валидации, которую  возвращаю 
// из своего middleware inputValidationResultMiddleware


import { ValidationErrorType } from './validationError';

export type ValidationErrorDto = { errorsMessages: ValidationErrorType[] };