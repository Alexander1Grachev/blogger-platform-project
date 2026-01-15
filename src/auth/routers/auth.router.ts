import { Request, Response, Router } from "express";
import { authInputDtoValidation } from "../middlewares/login.input-dto.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { HttpStatus } from "../../core/consts/http-statuses";
import { LoginInputDto } from "./dtos/login-input.model";
import { authService } from "../auth.service.ts/auth.service";


export const authRouter = Router();

authRouter
  .post('/login',
    authInputDtoValidation,
    inputValidationResultMiddleware,
    async (
      req: Request<{}, {}, LoginInputDto>,
      res: Response,
    ) => {

      const { loginOrEmail, password } = req.body;
      const isValid = await authService.checkUserCredentials(loginOrEmail, password)
      if (!isValid) return res.sendStatus(HttpStatus.Unauthorized);
      return res.sendStatus(HttpStatus.NoContent);

    }
  )