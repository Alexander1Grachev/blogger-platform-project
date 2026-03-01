import { Response, Request } from 'express'
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { UserInputDto } from '../../../users/application/dtos/user-input-dto';
import { authService } from '../../application/auth.service';

export async function registrationHandler(
  req: Request<{}, {}, UserInputDto>,
  res: Response,
) {
  try {
    await authService.register(req.body);
    res.sendStatus(HttpStatus.NoContent);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}