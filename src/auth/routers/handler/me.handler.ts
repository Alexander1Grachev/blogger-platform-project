import { Request, Response } from "express";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { authService } from "../../application/auth-user.service";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function meHandler(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.user!.id
    if (!userId)
      return res.sendStatus(HttpStatus.Unauthorized);
    const me = await authService.getMeView(userId)
    return res.status(HttpStatus.Ok).send(me)
  } catch (e: unknown) {
    return errorsHandler(e, res)
  }
}