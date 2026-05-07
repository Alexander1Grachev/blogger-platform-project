import { Request, Response } from "express";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { AuthService } from "../../application/auth-user.service";
import { errorsHandler } from "../../../core/errors/errors.handler";

export class MeController {
  constructor(private readonly authService: AuthService) { };
  handle = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const userId = req.user!.userId;
      const me = await this.authService.getMeView(userId)
      return res.status(HttpStatus.Ok).send(me)
    } catch (e: unknown) {
      return errorsHandler(e, res)
    }
  }
}