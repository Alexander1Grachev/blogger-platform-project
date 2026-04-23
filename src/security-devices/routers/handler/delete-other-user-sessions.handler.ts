import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from "../../../core/errors/errors.handler";
import { sessionService } from '../../application/session.service';



export async function deleteOtherUserSessionsHandler(
  req: Request,
  res: Response
) {
  try {
    const { userId, deviceId } = req.user as {
      userId: string;
      deviceId: string;
    };
    await sessionService.deleteOtherUserSessions(userId, deviceId);

    res.sendStatus(HttpStatus.NoContent)
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}

