import { TooManyRequestsError } from "../../core/errors/too-many-requests.error";
import { RateLimitLog } from "./rate-limit.model";
import { rateLimitRepository } from "./rate-limit.repository";



export const rateLimitService = {
  async checkAndLog(ip: string, url: string, maxRequests: number) {
    const count = await rateLimitRepository.countRequests(ip, url);

    console.log(`[rateLimitService] 📊 Before save count: ${count}/${maxRequests}`);

    if (count >= maxRequests) {
      throw new TooManyRequestsError('Too many requests');
    }

    const newRateLimitLog: RateLimitLog = {
      IP: ip,
      URL: url,
      date: new Date(),
    };

    await rateLimitRepository.createRequest(newRateLimitLog);
  }
};