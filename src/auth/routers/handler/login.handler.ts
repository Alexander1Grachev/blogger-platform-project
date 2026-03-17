import { Request, Response } from "express";
import { LoginInputDto } from "../../application/dtos/login-input.model";
import { authService } from "../../application/auth-user.service";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { appConfig } from "../../../core/config/config";

export async function loginHandler(
  req: Request<{}, {}, LoginInputDto>,
  res: Response,
) {
  try {
    const { loginOrEmail, password } = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(loginOrEmail, password)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: Number(appConfig.RT_TIME) * 1000, //в мс, а jwt библиотека в секундах
    });

    res.status(HttpStatus.Ok).send({accessToken});
  } catch (e: unknown) {
    errorsHandler(e, res)
  }
}