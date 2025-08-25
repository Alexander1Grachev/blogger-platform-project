import { Router, Request, Response } from 'express';
import { HttpStatus } from '../core/consts/http-statuses';
import { idValidation } from '../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../core/middlewares/validation/input-validtion-result.middleware';


export const testingIdValidationRouter = Router();
testingIdValidationRouter.get(
  '/check/:id',
  idValidation,
  inputValidationResultMiddleware, // <-- вот тут подключаешь свой middleware
  (req: Request, res: Response) => {
    // если дошли сюда — значит валидация прошла
    res.status(HttpStatus.Ok).json({ id: req.params.id });
  },
);
