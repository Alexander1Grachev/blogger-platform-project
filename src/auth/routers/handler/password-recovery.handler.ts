import { injectable, inject } from "inversify";

import { Request, Response } from "express";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { EmailInputDto } from "../input/email-input.model";
import { EmailService } from "../../application/auth-email.service ";

@injectable()
export class PasswordRecoveryController {
  constructor(@inject(EmailService) private readonly emailService: EmailService) { };
  handle = async (
    req: Request<{}, {}, EmailInputDto>,
    res: Response,
  ) => {
    try {
      await this.emailService.sendPasswordRecovery(req.body.email);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res)
    }
  }
}
