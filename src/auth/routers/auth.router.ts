import { Router } from "express";
import { authInputDtoValidation } from "../validation/login.input-dto.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { registrationConfirmationValidation } from "../validation/registration-confirmation.validation";
import { email, userInputDtoValidation } from "../../users/validation/user.input-dto.validation";
import { container } from "../../composition-root";
import { LoginController } from "./handler/login.handler";
import { MeController } from "./handler/me.handler";
import { RegistrationController } from "./handler/registration.handler";
import { RegistrationConfirmationController } from "./handler/registration-confirmation.handler";
import { RefreshTokenController } from "./handler/refresh-token.handler";
import { LogoutController } from "./handler/logout-token.handler ";
import { accessTokenGuardMiddleware } from "../middlewares/access.token.guard";
import { refreshTokenGuardMiddleware } from "../middlewares/refresh.token.guard";
import { rateLimitMiddleware } from "../../core/middlewares/rate-limit.middleware";
import { RegistrationEmailResendingController } from "./handler/registration-email-resending.handler";
import { PasswordRecoveryController } from "./handler/password-recovery.handler";
import { NewPasswordController } from "./handler/new-password.handler";
import { newPasswordRecoveryValidation } from "../validation/new-password-recovery.validation";

export const authRouter = Router();

authRouter
  .post(
    '/login',
    rateLimitMiddleware,
    authInputDtoValidation,
    inputValidationResultMiddleware,
    container.get(LoginController).handle
  );

authRouter.get(
  '/me',
  accessTokenGuardMiddleware,
  container.get(MeController).handle
);
authRouter.post(
  '/password-recovery',
  rateLimitMiddleware,
  email, //userInputDtoValidation
  inputValidationResultMiddleware,
  container.get(PasswordRecoveryController).handle
);

authRouter.post(
  '/new-password',
  rateLimitMiddleware,
  newPasswordRecoveryValidation,
  inputValidationResultMiddleware,
  container.get(NewPasswordController).handle
);

authRouter.post(
  '/registration-confirmation',
  rateLimitMiddleware,
  registrationConfirmationValidation,
  inputValidationResultMiddleware,
  container.get(RegistrationConfirmationController).handle
);

authRouter.post(
  '/registration',
  rateLimitMiddleware,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  container.get(RegistrationController).handle
);

authRouter.post(
  '/registration-email-resending',
  rateLimitMiddleware,
  email, //userInputDtoValidation
  inputValidationResultMiddleware,
  container.get(RegistrationEmailResendingController).handle
);

authRouter.post(
  '/refresh-token',
  refreshTokenGuardMiddleware,
  container.get(RefreshTokenController).handle

);

authRouter.post(
  '/logout',
  refreshTokenGuardMiddleware,
  container.get(LogoutController).handle

);
