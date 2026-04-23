import { ForbiddenError } from "../../core/errors/forbidden.error";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { Session } from "../../security-devices/repositories/models/session.model";
import { sessionRepository } from "../repositories/session.repository";
import { CreateSessionDto } from "./dtos/create-session.dto";


export const sessionService = {

  async findSessionByDeviceId(
    deviceId: string
  ): Promise<Session> {
    return await sessionRepository.findSessionByDeviceId(deviceId);
  },

  async createSession(dto: CreateSessionDto): Promise<void> {
    const newSession: Session = {
      userId: dto.userId,
      deviceId: dto.deviceId,
      deviceName: dto.deviceName,
      ip: dto.ip,
      lastActiveAt: new Date(dto.iat * 1000),
      expiresAt: new Date(dto.exp * 1000)
    };
    await sessionRepository.createSession(newSession);
  },

  async updateLastActive(deviceId: string, iat: number): Promise<void> {
    const iatDate = new Date(iat * 1000);// первож в дату
    await sessionRepository.updateLastActive(deviceId, iatDate);
  },

  async revokeSession(deviceId: string): Promise<void> {
    await sessionRepository.deleteDeviceSessions(deviceId);
  },

  async findUserSessions(userId: string): Promise<Session[]> {
    return await sessionRepository.findUserSessions(userId);
  },

  async deleteOtherUserSessions(userId: string, deviceId: string): Promise<void> {
    return sessionRepository.deleteOtherUserSessions(userId, deviceId);
  },

  async deleteDeviceSessions(userId: string, deviceId: string): Promise<void> {
    const session = await this.findSessionByDeviceId(deviceId);

    // если не твой device — 403
    if (session.userId.toString() !== userId) {
      throw new ForbiddenError();
    }

    // удаляем
    return sessionRepository.deleteDeviceSessions(session.deviceId);
  }
}


