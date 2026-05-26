import { Types } from "mongoose";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { ISession, SessionModel } from "./models/session.model";
import { injectable } from "inversify";


@injectable()
export class SessionQueryRepository {
  async createSession(newSession: ISession): Promise<void> {
    await SessionModel.create(newSession);
  }

  async findSessionByDeviceId(deviceId: string): Promise<ISession> {
    const session = await SessionModel.findOne({ deviceId }).lean();
    if (!session) {
      throw new RepositoryNotFoundError('Session does not exist');
    }
    return session
  }

  async findSessionByDeviceIdAuth(deviceId: string): Promise<ISession | null> {
    return await SessionModel.findOne({ deviceId }).lean();
  }

  async findUserSessions(userId: string): Promise<ISession[]> {
    return await SessionModel.find({
      userId: new Types.ObjectId(userId),
      lastActiveAt: { $ne: new Date(0) }
    }).lean();
    // не бросаем RepositoryNotFoundError --> вернуть пустой список валидно
  }

  async updateLastActive(deviceId: string, actualTokenIatTime: Date): Promise<void> {
    await SessionModel.updateOne(
      { deviceId },
      {
        $set: {
          'lastActiveAt': actualTokenIatTime,
        },
      },
    )
  }

  async deleteOtherUserSessions(userId: string, deviceId: string): Promise<void> {
    const deleteResult = await SessionModel.deleteMany({
      userId: new Types.ObjectId(userId),
      deviceId: { $ne: deviceId }
    });
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Sessions does not exist');
    }
  }

  async deleteDeviceSessions(deviceId: string): Promise<void> {
    const deleteResult = await SessionModel.deleteOne({ deviceId });
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Sessions does not exist');
    }
  }
}