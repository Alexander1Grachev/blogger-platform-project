import { Request, Response } from "express";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { appConfig } from "../../../core/config/config";
import { tokenService } from "../../application/auth-tokens.service ";

export async function refreshTokenHandler(
  req: Request,
  res: Response<{ "accessToken": string }>,
) {
  try {
    console.log("COOKIES:", req.cookies);

    const expiredRefreshToken = req.cookies?.refreshToken;
    console.log('Handler received refreshToken:', expiredRefreshToken);

    const { accessToken, refreshToken } = await tokenService.updateTokens(expiredRefreshToken)

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