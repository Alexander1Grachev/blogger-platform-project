import mongoose, { Types } from "mongoose";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { SessionDocument, SessionModel } from "../domain/session.entity";


@injectable()
export class SessionRepository {
  async save(newSession: SessionDocument): Promise<void> {
    await newSession.save();
  }

  async deleteOtherUserSessions(userId: string, deviceId: string): Promise<void> {
    const deleteResult = await SessionModel.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
      deviceId: { $ne: deviceId }
    });
  }

  async deleteDeviceSessions(deviceId: string): Promise<void> {
    const deleteResult = await SessionModel.deleteOne({ deviceId });
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Sessions does not exist');
    }
  }
}