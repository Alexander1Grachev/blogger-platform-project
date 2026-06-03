import { container } from "../../composition-root";

import { NextFunction, Request, Response } from 'express';
import { JwtService } from '../../auth/adapters/jwt.service';
import { HttpStatus } from '../consts/http-statuses';
import { errorsHandler } from '../errors/errors.handler';

const jwtService = container.get(JwtService);

export const likeStatusMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const [authType, token] = authHeader.split(' ');
    if (authType !== 'Bearer' || !token) return res.sendStatus(HttpStatus.Unauthorized);

    const payload = await jwtService.verifyAccessToken(token);
    if (!payload || !payload.userId) return res.sendStatus(HttpStatus.Unauthorized);

    req.user = {
      userId: payload.userId
    }
    next();
  } catch (e: unknown) {
    return errorsHandler(e, res)
  }
};
