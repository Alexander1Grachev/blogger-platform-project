import { injectable, inject } from "inversify";

import { Request, Response } from "express";
import { AuthService } from "../../application/auth-user.service";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { newPasswordRecoveryInputModel } from "../input/new-password-recovery-input.model";

@injectable()
export class NewPasswordController {
  constructor(@inject(AuthService) private readonly authService: AuthService) { }

  handle = async (
    req: Request<{}, {}, newPasswordRecoveryInputModel>,
    res: Response,
  ) => {
    try {
      await this.authService.passwordRecovery(req.body.newPassword, req.body.recoveryCode)
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
