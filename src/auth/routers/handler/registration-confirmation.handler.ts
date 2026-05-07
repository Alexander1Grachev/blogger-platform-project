import { Response, Request } from 'express'
import { HttpStatus } from "../../../core/consts/http-statuses";
import { RegistrationConfirmationInputDto } from "../input/registration-confirmation-Input.model";
import { errorsHandler } from '../../../core/errors/errors.handler';
import { EmailService } from '../../application/auth-email.service ';

export class RegistrationConfirmationController {
  constructor(private readonly emailService: EmailService) { };

  handle = async (
    req: Request<{}, {}, RegistrationConfirmationInputDto>,
    res: Response,
  ) => {
    try {
      await this.emailService.confirmEmail(req.body.code)

      res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
      errorsHandler(e, res)
    }
  }
}


