import {  Router } from "express";
import { authInputDtoValidation } from "../middlewares/login.input-dto.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { accessTokenGuard } from "../middlewares/access.token.guard";
import { registrationConfirmHandler } from "./handler/registration-confirmation.handler";
import { registrationConfirmationValidation } from "../validation/registration-confirmation.validation";
import { registrationHandler } from "./handler/registration.handler";
import { email, userInputDtoValidation } from "../../users/validation/user.input-dto.validation";
import { registrationEmailResendingHandler } from "./handler/registration-email-resending.handler";
import { loginHandler } from "./handler/login.handler";
import { meHandler } from "./handler/me.handler";


export const authRouter = Router();

authRouter
  .post('/login',
    authInputDtoValidation,
    inputValidationResultMiddleware,
    loginHandler
  );

authRouter.get('/me',
  accessTokenGuard,
  meHandler
)
authRouter.post('/registration-confirmation',
  registrationConfirmationValidation,
  inputValidationResultMiddleware,
  registrationConfirmHandler
)

authRouter.post('/registration',
  userInputDtoValidation,
  inputValidationResultMiddleware,
  registrationHandler
)

authRouter.post('/registration-email-resending',
  email, //userInputDtoValidation
  inputValidationResultMiddleware,
  registrationEmailResendingHandler
)
