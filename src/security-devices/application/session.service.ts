import { ForbiddenError } from "../../core/errors/forbidden.error";
import { ISession, SessionModel } from "../../security-devices/repositories/models/session.model";
import { SessionRepository } from "../repositories/session.repository";
import { SessionQueryRepository } from "../repositories/session..query.repository";

import { CreateSessionDto } from "./dtos/create-session.dto";
import { injectable, inject } from "inversify";


@injectable()
export class SessionService {
  constructor(
    @inject(SessionRepository) private readonly sessionRepository: SessionRepository,
    @inject(SessionQueryRepository) private readonly sessionQueryRepository: SessionQueryRepository
  ) { };

  async findSessionByDeviceId(
    deviceId: string
  ): Promise<ISession> {
    return await this.sessionQueryRepository.findSessionByDeviceId(deviceId);
  }

  async createSession(dto: CreateSessionDto): Promise<void> {
    const newSession = new SessionModel;
    newSession.userId = dto.userId
    newSession.deviceId = dto.deviceId
    newSession.deviceName = dto.deviceName
    newSession.ip = dto.ip
    newSession.lastActiveAt = new Date(dto.iat * 1000)
    newSession.expiresAt = new Date(dto.exp * 1000)

    await this.sessionRepository.createSession(newSession);
  }

  async updateLastActive(deviceId: string, iat: number): Promise<void> {
    const iatDate = new Date(iat * 1000);// первож в дату
    await this.sessionRepository.updateLastActive(deviceId, iatDate);
  }

  async revokeSession(deviceId: string): Promise<void> {
    await this.sessionRepository.deleteDeviceSessions(deviceId);
  }

  async findUserSessions(userId: string): Promise<ISession[]> {
    return await this.sessionQueryRepository.findUserSessions(userId);
  }

  async deleteOtherUserSessions(userId: string, deviceId: string): Promise<void> {
    await this.sessionRepository.deleteOtherUserSessions(userId, deviceId);
  }

  async deleteDeviceSessions(userId: string, deviceId: string): Promise<void> {
    const session = await this.findSessionByDeviceId(deviceId);

    // если не твой device — 403
    if (session.userId.toString() !== userId) {
      throw new ForbiddenError();
    }

    // удаляем
    this.sessionRepository.deleteDeviceSessions(session.deviceId);
  }
}


