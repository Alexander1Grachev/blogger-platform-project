import { Response, Request } from 'express'
import { HttpStatus } from "../../../core/consts/http-statuses";
import { RegistrationConfirmationInputDto } from "../../application/dtos/registration-confirmation-Input.model";
import { authService } from '../../application/auth.service';
import { errorsHandler } from '../../../core/errors/errors.handler';


export async function registrationConfirmHandler(
  req: Request<{}, {}, RegistrationConfirmationInputDto>,
  res: Response,
) {
  try {
    await authService.confirmEmail(req.body.code)

    res.sendStatus(HttpStatus.NoContent)
  } catch (e: unknown) {
    errorsHandler(e, res)
  }
}



