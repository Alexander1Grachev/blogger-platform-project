import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from "../../../core/errors/errors.handler";
import { SessionService } from '../../application/session.service';
import { injectable, inject } from "inversify";


@injectable()
export class DeleteDeviceSessionsController {
  constructor(@inject(SessionService) private readonly sessionService: SessionService) { };

  handle = async (
    req: Request<{ deviceId: string }>,
    res: Response
  ) => {
    try {
      const deviceId = req.params.deviceId;
      const userId = req.user!.userId;
      await this.sessionService.deleteDeviceSessions(userId, deviceId);

      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      return errorsHandler(e, res);
    }
  }
}