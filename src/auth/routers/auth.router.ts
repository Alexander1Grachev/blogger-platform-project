import { Request, Response, Router } from "express";
import { authInputDtoValidation } from "../middlewares/login.input-dto.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { HttpStatus } from "../../core/consts/http-statuses";
import { LoginInputDto } from "../application/dtos/login-input.model";
import { authService } from "../application/auth.service";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { accessTokenGuard } from "../middlewares/access.token.guard";
import { errorsHandler } from "../../core/errors/errors.handler";


export const authRouter = Router();

authRouter
  .post('/login',
    authInputDtoValidation,
    inputValidationResultMiddleware,
    async (
      req: Request<{}, {}, LoginInputDto>,
      res: Response,
    ) => {
      try {
        const { loginOrEmail, password } = req.body;
        const accessToken = await authService.loginUser(loginOrEmail, password)

        res.status(HttpStatus.Ok).send(accessToken);
      } catch (e: unknown) {
        errorsHandler(e, res)
      }
    }
  );

authRouter.get('/me',
  accessTokenGuard,
  async (
    req: Request,
    res: Response,
  ) => {
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
)