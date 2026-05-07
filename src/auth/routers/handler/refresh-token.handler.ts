import { Request, Response } from "express";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { appConfig } from "../../../core/config/config";
import { SessionService } from "../../../security-devices/application/session.service";
import { JwtService } from "../../adapters/jwt.service";



export class RefreshTokenController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService
  ) { };

  handle = async (
    req: Request,
    res: Response<{ "accessToken": string }>,
  ) => {
    try {
      const { userId, deviceId } = req.user as {
        userId: string;
        deviceId: string;
      };

      const accessToken = this.jwtService.createAccessToken(userId);
      const refreshToken = this.jwtService.createRefreshToken(
        userId,
        deviceId,
      );

      const payload = this.jwtService.decodeToken(refreshToken) as { iat: number }

      await this.sessionService.updateLastActive(deviceId, payload.iat);


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
}