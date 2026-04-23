import { ObjectId } from "mongodb";

export interface CreateSessionDto {
  userId: ObjectId;
  ip: string;
  deviceName: string;
  deviceId: string;
  iat: number;
  exp: number;
}