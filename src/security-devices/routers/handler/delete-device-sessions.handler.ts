import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/consts/http-statuses';
import { errorsHandler } from "../../../core/errors/errors.handler";
import { sessionService } from '../../application/session.service';


export async function deleteDeviceSessionsHandler(
  req: Request<{ deviceId: string }>,
  res: Response
) {
  try {
    const deviceId = req.params.deviceId;
    const userId = req.user!.userId;
    await sessionService.deleteDeviceSessions(userId, deviceId);
    
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}