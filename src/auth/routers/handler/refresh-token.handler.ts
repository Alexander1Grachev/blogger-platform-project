import { Request, Response } from "express";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { appConfig } from "../../../core/config/config";
import { sessionService } from "../../../security-devices/application/session.service";
import { jwtService } from "../../adapters/jwt.service";

export async function refreshTokenHandler(
  req: Request,
  res: Response<{ "accessToken": string }>,
) {
  try {
    const { userId, deviceId } = req.user as {
      userId: string;
      deviceId: string;
    };

    const accessToken = jwtService.createAccessToken(userId);
    const refreshToken = jwtService.createRefreshToken(
      userId,
      deviceId,
    );

    const payload = jwtService.decodeToken(refreshToken) as { iat: number }

    await sessionService.updateLastActive(deviceId, payload.iat);


    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: Number(appConfig.RT_TIME) * 1000,
    });

    res.status(HttpStatus.Ok).send({ accessToken });
  } catch (e: unknown) {
    errorsHandler(e, res)
  }
}