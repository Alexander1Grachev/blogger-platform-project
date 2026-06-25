import mongoose, { Types } from "mongoose";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { SessionDocument, SessionModel } from "../domain/session.entity";


@injectable()
export class SessionQueryRepository {

  async findSessionByDeviceIdOrFail(deviceId: string): Promise<SessionDocument> {
    const session = await SessionModel.findOne({ deviceId });
    if (!session) {
      throw new RepositoryNotFoundError('Session does not exist');
    }
    return session
  }

  async findSessionByDeviceIdAuth(deviceId: string): Promise<SessionDocument | null> {
    return await SessionModel.findOne({ deviceId });
  }

  async findUserSessions(userId: string): Promise<SessionDocument[]> {
    return await SessionModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      lastActiveAt: { $ne: new Date(0) }
    });
    // не бросаем RepositoryNotFoundError --> вернуть пустой список валидно
  }

}