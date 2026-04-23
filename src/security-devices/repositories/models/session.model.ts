import { ObjectId } from "mongodb";

export interface Session {
  userId: ObjectId;// ссылка на пользователя в MongoDB, удобно для индексации и поиска всех сессий
  deviceId: string; // UUID, уникальный для каждой сессии, безопасно использовать в JWT
  deviceName: string;
  ip: string;
  lastActiveAt: Date;//это свойство сессии/ а девайсы iat issuedAt в JWT — это свойство токена
  expiresAt: Date;
}