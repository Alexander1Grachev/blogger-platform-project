import { NextFunction, Request, Response } from 'express';
import { rateLimitService } from '../../infrastructure/rate-limit/rate-limit-service';
import { HttpStatus } from '../consts/http-statuses';
import { TooManyRequestsError } from '../errors/too-many-requests.error';


export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userIp = req.ip || '0.0.0.0';
    const url = req.originalUrl.split('?')[0];
    const MAX_REQUESTS = 5;

    console.log(`[rateLimitMiddleware] 📥: | IP: ${userIp} | URL: ${url}`);

    await rateLimitService.checkAndLog(userIp, url, MAX_REQUESTS);

    next();
  } catch (e: unknown) {
    console.log('[rateLimitMiddleware] 🚫 ERROR:', e);
    if (e instanceof TooManyRequestsError) {
      res.sendStatus(HttpStatus.TooManyRequests);
      return;
    }
    res.sendStatus(HttpStatus.InternalServerError);
  }
}