import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export interface CreateSessionDto {
  userId: mongoose.Types.ObjectId;
  ip: string;
  deviceName: string;
  deviceId: string;
  iat: number;
  exp: number;
}