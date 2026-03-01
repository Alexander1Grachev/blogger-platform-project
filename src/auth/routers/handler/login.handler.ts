import { Request, Response } from "express";
import { LoginInputDto } from "../../application/dtos/login-input.model";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function loginHandler(
    req: Request<{}, {}, LoginInputDto>,
    res: Response,
) {
    try {
        const { loginOrEmail, password } = req.body;
        const accessToken = await authService.loginUser(loginOrEmail, password)

        res.status(HttpStatus.Ok).send(accessToken);
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}