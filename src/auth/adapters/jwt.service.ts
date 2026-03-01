import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { appConfig } from "../../core/config/config";

export const jwtService = {
  createToken(userId: string): string {
    const expiresIn = Number(appConfig.AC_TIME); // ожидаем число секунд

    return jwt.sign(
      { userId },
      appConfig.AC_SECRET,
      { expiresIn } as SignOptions
    );
  },

  decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token);
      return decoded as JwtPayload | null;
    } catch (e) {
      console.error("Can't decode token", e);
      return null;
    }
  },

  verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, appConfig.AC_SECRET) as { userId: string };
    } catch (e) {
      console.error("Token verification error", e);
      return null;
    }
  },
};


