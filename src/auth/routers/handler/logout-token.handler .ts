import { Request, Response } from "express";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { sessionService } from "../../../security-devices/application/session.service";

export async function logoutHandler(
  req: Request,
  res: Response,
) {
  try {
    const deviceId = req.user?.deviceId as string;

    await sessionService.revokeSession(deviceId)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res)
  }
}