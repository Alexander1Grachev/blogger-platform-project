import 'express';// обязательно!
declare global {
  namespace Express {
    export interface Request {
      user?: {
        userId: string;
        deviceId?: string;
      };
    }
  }
}

