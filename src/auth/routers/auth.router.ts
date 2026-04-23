import { Router } from "express";
import { authInputDtoValidation } from "../validation/login.input-dto.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { accessTokenGuard } from "../middlewares/access.token.guard";
import { registrationConfirmHandler } from "./handler/registration-confirmation.handler";
import { registrationConfirmationValidation } from "../validation/registration-confirmation.validation";
import { registrationHandler } from "./handler/registration.handler";
import { email, userInputDtoValidation } from "../../users/validation/user.input-dto.validation";
import { registrationEmailResendingHandler } from "./handler/registration-email-resending.handler";
import { loginHandler } from "./handler/login.handler";
import { meHandler } from "./handler/me.handler";
import { refreshTokenGuard } from "../middlewares/refresh.token.guard";
import { logoutHandler } from "./handler/logout-token.handler ";
import { refreshTokenHandler } from "./handler/refresh-token.handler";
import { rateLimitMiddleware } from "../../core/middlewares/rate-limit.middleware";


export const authRouter = Router();

authRouter
  .post(
    '/login',
    rateLimitMiddleware,
    authInputDtoValidation,
    inputValidationResultMiddleware,
    loginHandler
  );

authRouter.get(
  '/me',
  accessTokenGuard,
  meHandler
);

authRouter.post(
  '/registration-confirmation',
  rateLimitMiddleware,
  registrationConfirmationValidation,
  inputValidationResultMiddleware,
  registrationConfirmHandler
);

authRouter.post(
  '/registration',
  rateLimitMiddleware,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  registrationHandler
);

authRouter.post(
  '/registration-email-resending',
  rateLimitMiddleware,
  email, //userInputDtoValidation
  inputValidationResultMiddleware,
  registrationEmailResendingHandler
);

authRouter.post(
  '/refresh-token',
  refreshTokenGuard,
  refreshTokenHandler,
);

authRouter.post(
  '/logout',
  refreshTokenGuard,
  logoutHandler,
);
