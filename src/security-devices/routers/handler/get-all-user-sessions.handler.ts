import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from "../../../core/errors/errors.handler";
import { sessionService } from '../../application/session.service';
import { mapToDeviceViewModel } from '../../application/mappers/map-to-device-output.util';



export async function getAllUserSessionsHandler(
  req: Request,
  res: Response,
) {
  try {

    const userId = req.user!.userId;

    const sessions = await sessionService.findUserSessions(userId);
    const sessionsOutput = sessions.map(mapToDeviceViewModel);
    return res.status(HttpStatus.Ok).send(sessionsOutput);
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}