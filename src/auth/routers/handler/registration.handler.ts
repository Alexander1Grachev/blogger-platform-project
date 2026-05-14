import { Response, Request } from 'express'
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { UserInputDto } from '../../../users/routers/input/user-input-dto';
import { AuthService } from '../../application/auth-user.service';
import { injectable, inject } from "inversify";

@injectable()
export class RegistrationController {
  constructor(@inject(AuthService)private readonly authService: AuthService) { };

  handle = async (
    req: Request<{}, {}, UserInputDto>,
    res: Response,
  ) => {
    try {
      await this.authService.register(req.body);
      res.sendStatus(HttpStatus.NoContent);

    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}