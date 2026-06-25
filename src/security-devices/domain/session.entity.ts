import mongoose, { HydratedDocument, model, Model, Schema } from "mongoose";
import { CreateSessionDto } from "../application/dtos/create-session.dto";



export class SessionEntity {
  private constructor(
    public userId: mongoose.Types.ObjectId,// ссылка на пользователя в MongoDB, удобно для индексации и поиска всех сессий
    public deviceId: string, // UUID, уникальный для каждой сессии, безопасно использовать в JWT
    public deviceName: string,
    public ip: string,
    public lastActiveAt: Date,//это свойство сессии/ а девайсы iat issuedAt в JWT — это свойство токена
    public expiresAt: Date,
  ) { };

  updateLastActive(iat: number): void {
    this.lastActiveAt = new Date(iat * 1000);
  }

  static createSession(dto: CreateSessionDto): SessionDocument {
    return new SessionModel({
      userId: new mongoose.Types.ObjectId(dto.userId),
      deviceId: dto.deviceId,
      deviceName: dto.deviceName,
      ip: dto.ip,
      lastActiveAt: new Date(dto.iat * 1000),
      expiresAt: new Date(dto.exp * 1000),
    }) as SessionDocument;
  }
}


interface SessionMethods {
  updateLastActive(iat: number): void;
}

interface SessionStatics {
  createSession(dto: CreateSessionDto): SessionDocument;
}

type SessionModel = Model<SessionEntity, {}, SessionMethods> & SessionStatics;
export type SessionDocument = HydratedDocument<SessionEntity, SessionMethods>;

export const SessionSchema = new mongoose.Schema<SessionEntity, SessionModel>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  deviceId: { type: String, required: true },
  deviceName: { type: String, required: true },
  ip: { type: String, required: true },
  lastActiveAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

SessionSchema.loadClass(SessionEntity);

export const SessionModel = mongoose.model<SessionEntity, SessionModel>(
  'Session',
  SessionSchema,
);