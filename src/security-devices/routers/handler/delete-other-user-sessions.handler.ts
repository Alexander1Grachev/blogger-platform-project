import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from "../../../core/errors/errors.handler";
import { SessionService } from '../../application/session.service';
import { injectable, inject } from "inversify";


@injectable()
export class DeleteOtherUserSessionsController {
  constructor(@inject(SessionService) private readonly sessionService: SessionService) { };

  handle = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { userId, deviceId } = req.user as {
        userId: string;
        deviceId: string;
      };
      await this.sessionService.deleteOtherUserSessions(userId, deviceId);

      res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
      return errorsHandler(e, res);
    }
  }
}
