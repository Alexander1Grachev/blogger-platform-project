import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../adapters/jwt.service';
import { HttpStatus } from '../../core/consts/http-statuses';
import { UnauthorizedError } from '../../core/errors/unauthorized.error';
import { authService } from '../application/auth-user.service';


export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    // console.log('Guard sees refreshToken:', refreshToken);
    if (!refreshToken) {
      res.sendStatus(HttpStatus.Unauthorized);
      return
    }
    const payload = jwtService.verifyRefreshToken(refreshToken);
   // console.log('Guard verifyRefreshToken payload:', payload);
    if (
      !payload ||
      !payload.userId ||
      !payload.deviceId ||
      !payload.iat ||
      !payload.exp
    ) {
      res.sendStatus(HttpStatus.Unauthorized);
      return
    }
    // сравниваем number в миллисекундах 
    // JWT -- секунды
    // JS -- миллисекунды
    if (payload.exp * 1000 < Date.now()) {
      res.sendStatus(HttpStatus.Unauthorized)
      return
    }

    await authService.sessionValidation(payload.deviceId, payload.iat);

    req.user = {
      userId: payload.userId,
      deviceId: payload.deviceId,
    };

    return next();
  } catch (e: unknown) {
    if (e instanceof UnauthorizedError) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    console.error(e);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};






