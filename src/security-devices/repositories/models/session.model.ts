import mongoose, { HydratedDocument, model, Model, Schema } from "mongoose";
import { ObjectId } from "mongodb"
export interface ISession {
  userId: ObjectId;// ссылка на пользователя в MongoDB, удобно для индексации и поиска всех сессий
  deviceId: string; // UUID, уникальный для каждой сессии, безопасно использовать в JWT
  deviceName: string;
  ip: string;
  lastActiveAt: Date;//это свойство сессии/ а девайсы iat issuedAt в JWT — это свойство токена
  expiresAt: Date;
}


export type SessionDocument = HydratedDocument<ISession>;

type SessionModel = Model<ISession>;

export const SessionSchema = new mongoose.Schema<ISession, SessionModel>({
  userId: { type: Schema.Types.ObjectId, required: true },// по этому поменял на это но не уверен Schema.Types.ObjectId из mongoose!import { ObjectId } from "mongodb";
  deviceId: { type: String, required: true },
  deviceName: { type: String, required: true },
  ip: { type: String, required: true },
  lastActiveAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
})

export const SessionModel: SessionModel = model<ISession, SessionModel>('Session', SessionSchema);