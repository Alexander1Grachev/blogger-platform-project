import { ForbiddenError } from "../../core/errors/forbidden.error";
import { SessionRepository } from "../repositories/session.repository";
import { SessionQueryRepository } from "../repositories/session..query.repository";

import { CreateSessionDto } from "./dtos/create-session.dto";
import { injectable, inject } from "inversify";
import { SessionDocument, SessionModel } from "../domain/session.entity";


@injectable()
export class SessionService {
  constructor(
    @inject(SessionRepository) private readonly sessionRepository: SessionRepository,
    @inject(SessionQueryRepository) private readonly sessionQueryRepository: SessionQueryRepository
  ) { };

  async findSessionByDeviceId(
    deviceId: string
  ): Promise<SessionDocument> {
    return await this.sessionQueryRepository.findSessionByDeviceIdOrFail(deviceId);
  }

  async createSession(dto: CreateSessionDto): Promise<void> {

    const newSession = SessionModel.createSession(dto);
    await this.sessionRepository.save(newSession);
  }

  async updateLastActive(deviceId: string, iat: number): Promise<void> {
    const session = await this.sessionQueryRepository.findSessionByDeviceIdOrFail(deviceId)

    session.updateLastActive(iat);
    await this.sessionRepository.save(session);
  }

  async revokeSession(deviceId: string): Promise<void> {
    await this.sessionRepository.deleteDeviceSessions(deviceId);
  }

  async findUserSessions(userId: string): Promise<SessionDocument[]> {
    return await this.sessionQueryRepository.findUserSessions(userId);
  }

  async deleteOtherUserSessions(userId: string, deviceId: string): Promise<void> {
    await this.sessionRepository.deleteOtherUserSessions(userId, deviceId);
  }

  async deleteDeviceSessions(userId: string, deviceId: string): Promise<void> {
    const session = await this.sessionQueryRepository.findSessionByDeviceIdOrFail(deviceId);

    // если не твой device — 403
    if (session.userId.toString() !== userId) {
      throw new ForbiddenError();
    }

    // удаляем
    this.sessionRepository.deleteDeviceSessions(session.deviceId);
  }
}


