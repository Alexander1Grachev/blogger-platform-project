import { jwtService } from "../adapters/jwt.service";
import { UnauthorizedError } from "../../core/errors/unauthorized.error";
import { refreshTokenRepository } from "../repositories/refreshToken.repository";
import { appConfig } from "../../core/config/config";

export const tokenService = {
  async validateRefreshToken(token: string) {
    console.log("validateRefreshToken - incoming token:", token);
    const tokenFromDb = await refreshTokenRepository.find(token);
    console.log("validateRefreshToken - token from DB:", tokenFromDb);

    if (!tokenFromDb || tokenFromDb.isRevoked || tokenFromDb.expiresAt < new Date()) {
      console.log("validateRefreshToken - token invalid or revoked");
      throw new UnauthorizedError();
    }

    return tokenFromDb;
  },

  async updateTokens(
    expiredRefreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    console.log("updateTokens - expiredRefreshToken:", expiredRefreshToken);
    const payload = jwtService.verifyRefreshToken(expiredRefreshToken);
    console.log("updateTokens - verifyRefreshToken payload:", payload);
    if (!payload) {
      throw new UnauthorizedError();
    }
    const tokenFromDb = await this.validateRefreshToken(expiredRefreshToken);

    console.log("updateTokens - revoking old token:", expiredRefreshToken);
    await refreshTokenRepository.revoke(expiredRefreshToken);

    const userId = tokenFromDb.userId;

    const accessToken = jwtService.createAccessToken(userId);
    const newRefreshToken = jwtService.createRefreshToken(userId);
    console.log("updateTokens - new tokens:", { accessToken, newRefreshToken });
    await refreshTokenRepository.createRefreshToken({
      refreshToken: newRefreshToken,
      userId,
      expiresAt: new Date(Date.now() + Number(appConfig.RT_TIME) * 1000),
      isRevoked: false,
    });
    return { accessToken, refreshToken: newRefreshToken };
  },

  async revokeRefreshToken(expiredRefreshToken: string): Promise<void> {
    await this.validateRefreshToken(expiredRefreshToken);
    await refreshTokenRepository.revoke(expiredRefreshToken);
  },
};

