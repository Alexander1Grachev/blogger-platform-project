import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../adapters/jwt.service';
import { HttpStatus } from '../../core/consts/http-statuses';
import { errorsHandler } from '../../core/errors/errors.handler';


export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    console.log('Guard sees refreshToken:', refreshToken);
    if (!refreshToken) return res.sendStatus(HttpStatus.Unauthorized);

    const payload = jwtService.verifyRefreshToken(refreshToken);
    console.log('Guard verifyRefreshToken payload:', payload);
    if (!payload || !payload.userId) return res.sendStatus(HttpStatus.Unauthorized);

    //req.refreshToken = refreshToken;
    next();
  } catch (e: unknown) {
    return errorsHandler(e, res)
  }
};
