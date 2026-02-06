import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../adapters/jwt.service';
import { IdType } from '../../core/types/id';
import { HttpStatus } from '../../core/consts/http-statuses';
import { errorsHandler } from '../../core/errors/errors.handler';


export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(HttpStatus.Unauthorized);

    const [authType, token] = authHeader.split(' ');
    if (authType !== 'Bearer' || !token) return res.sendStatus(HttpStatus.Unauthorized);

    const payload = await jwtService.verifyToken(token);
    if (!payload || !payload.userId) return res.sendStatus(HttpStatus.Unauthorized);

    req.user = { id: payload.userId } as IdType;
    next();
  } catch (e: unknown) {
    return errorsHandler(e, res)
  }
};
