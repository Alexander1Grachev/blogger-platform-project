import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { appConfig } from "../../core/config/config";

export const jwtService = {
  createAccessToken(userId: string): string {
    const expiresIn = appConfig.AC_TIME; // ожидаем число секунд

    console.log("AC_TIME:", appConfig.AC_TIME);
    console.log("expiresIn:", expiresIn);

    return jwt.sign(
      { userId },
      appConfig.AC_SECRET,
      { expiresIn } as SignOptions
    );
  },
  createRefreshToken(userId: string): string {
    const expiresIn = appConfig.RT_TIME;

    console.log("RT_TIME:", appConfig.RT_TIME);
    console.log("expiresIn:", expiresIn);

    return jwt.sign(
      { userId, jti: crypto.randomUUID() }, // jti гарантирует уникальность
      appConfig.RT_SECRET,
      { expiresIn } as SignOptions,
    )
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

  verifyAccessToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, appConfig.AC_SECRET) as { userId: string };
    } catch (e) {
      console.error("Token verification error", e);
      return null;
    }
  },

  verifyRefreshToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, appConfig.RT_SECRET) as { userId: string, jti: string };
    } catch (e) {
      console.error("Token verification error", e);
      return null;
    }
  }

}
