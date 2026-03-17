import { refreshTokenCollection } from "../../db/mongo.db";
import { RefreshTokenDbModel } from "../models/refresh-token.model";


export const refreshTokenRepository = {
  async createRefreshToken(tokenData: RefreshTokenDbModel): Promise<void> {
    await refreshTokenCollection.insertOne(tokenData)
  },
  async revoke(refreshToken: string): Promise<void> {
    await refreshTokenCollection.updateOne(
      { refreshToken },
      { $set: { isRevoked: true } 
    })
  },
  async find(refreshToken: string): Promise<RefreshTokenDbModel | null> {
    return await refreshTokenCollection.findOne({ refreshToken });
  },
}