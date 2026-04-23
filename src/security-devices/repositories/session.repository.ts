import { ObjectId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { sessionCollection } from "../../infrastructure/db/mongo.db";
import { Session } from "./models/session.model";


export const sessionRepository = {
  async createSession(newSession: Session): Promise<void> {
    await sessionCollection.insertOne(newSession);
  },

  async findSessionByDeviceId(deviceId: string): Promise<Session> {
    const session = await sessionCollection.findOne({ deviceId });
    if (!session) {
      throw new RepositoryNotFoundError('Session not exist');
    }
    return session
  },

  async findSessionByDeviceIdAuth(deviceId: string): Promise<Session | null> {
    return await sessionCollection.findOne({ deviceId });
  },

  async findUserSessions(userId: string): Promise<Session[]> {
    return await sessionCollection.find({
      userId: new ObjectId(userId),
      lastActiveAt: { $ne: new Date(0) }
    }).toArray();
    // не бросаем RepositoryNotFoundError --> вернуть пустой список валидно
  },

  async updateLastActive(deviceId: string, actualTokenIatTime: Date): Promise<void> {
    await sessionCollection.updateOne(
      { deviceId },
      {
        $set: {
          'lastActiveAt': actualTokenIatTime,
        },
      },
    )
  },

  async deleteOtherUserSessions(userId: string, deviceId: string): Promise<void> {
    const deleteResult = await sessionCollection.deleteMany({
      userId: new ObjectId(userId),
      deviceId: { $ne: deviceId }
    });
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Sessions not exist');
    }
    return;
  },

  async deleteDeviceSessions(deviceId: string): Promise<void> {
    const deleteResult = await sessionCollection.deleteOne({ deviceId });
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Sessions not exist');
    }
    return;
  }
}