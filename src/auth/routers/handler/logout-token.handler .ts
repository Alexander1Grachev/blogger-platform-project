import { Request, Response } from "express";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { tokenService } from "../../application/auth-tokens.service ";

export async function logoutHandler(
  req: Request,
  res: Response,
) {
  try {
    const expiredRefreshToken =  req.cookies?.refreshToken;
    await tokenService.revokeRefreshToken(expiredRefreshToken)

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res)
  }
}