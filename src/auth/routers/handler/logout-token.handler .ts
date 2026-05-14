import { Request, Response } from "express";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { SessionService } from "../../../security-devices/application/session.service";
import { injectable, inject } from "inversify";

@injectable()
export class LogoutController {
  constructor(@inject(SessionService) private readonly sessionService: SessionService) { };

  handle = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const deviceId = req.user?.deviceId as string;

      await this.sessionService.revokeSession(deviceId)
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
      });
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res)
    }
  }
}