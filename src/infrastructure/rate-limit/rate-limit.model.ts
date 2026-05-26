import mongoose, { HydratedDocument, model, Model } from "mongoose";


export interface IRateLimit {
  IP: string,
  URL: string,
  date: Date,
}

type RateLimitModel = Model<IRateLimit>;

export type RateLimitDocument = HydratedDocument<IRateLimit>;

export const RateLimitSchema = new mongoose.Schema<IRateLimit, RateLimitModel>({
  IP: { type: String, required: true },
  URL: { type: String, required: true },
  date: { type: Date, required: true },
})

export const RateLimitModel: RateLimitModel = model<IRateLimit, RateLimitModel>('RateLimit', RateLimitSchema)