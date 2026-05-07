import { Router } from "express";
import { authInputDtoValidation } from "../validation/login.input-dto.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { registrationConfirmationValidation } from "../validation/registration-confirmation.validation";
import { email, userInputDtoValidation } from "../../users/validation/user.input-dto.validation";

import {
  loginController,
  meController,
  registrationController,
  registrationConfirmationController,
  registrationEmailResendingController,
  refreshTokenController,
  logoutController,
  accessTokenGuardMiddleware,
  refreshTokenGuardMiddleware,
  rateLimitMiddleware,
} from "../../composition-root";

export const authRouter = Router();

authRouter
  .post(
    '/login',
    rateLimitMiddleware,
    authInputDtoValidation,
    inputValidationResultMiddleware,
    loginController.handle
  );

authRouter.get(
  '/me',
  accessTokenGuardMiddleware,
  meController.handle
);

authRouter.post(
  '/registration-confirmation',
  rateLimitMiddleware,
  registrationConfirmationValidation,
  inputValidationResultMiddleware,
  registrationConfirmationController.handle
);

authRouter.post(
  '/registration',
  rateLimitMiddleware,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  registrationController.handle
);

authRouter.post(
  '/registration-email-resending',
  rateLimitMiddleware,
  email, //userInputDtoValidation
  inputValidationResultMiddleware,
  registrationEmailResendingController.handle
);

authRouter.post(
  '/refresh-token',
  refreshTokenGuardMiddleware,
  refreshTokenController.handle,
);

authRouter.post(
  '/logout',
  refreshTokenGuardMiddleware,
  logoutController.handle,
);
