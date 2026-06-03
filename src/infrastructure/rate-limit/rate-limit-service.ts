import { TooManyRequestsError } from "../../core/errors/too-many-requests.error";
import { RateLimitModel } from "./rate-limit.model";
import { RateLimitRepository } from "./rate-limit.repository";
import { injectable, inject } from "inversify";


@injectable()
export class RateLimitService {
  constructor(@inject(RateLimitRepository) private readonly rateLimitRepository: RateLimitRepository) { };

  async checkAndLog(ip: string, url: string, maxRequests: number) {
    const count = await this.rateLimitRepository.countRequests(ip, url);

   // console.log(`[rateLimitService] 📊 Before save count: ${count}/${maxRequests}`);

    if (count >= maxRequests) {
      throw new TooManyRequestsError('Too many requests');
    }

    const newRateLimit = new RateLimitModel;
    newRateLimit.IP = ip
    newRateLimit.URL = url
    newRateLimit.date = new Date()


    await this.rateLimitRepository.createRequest(newRateLimit);
  }
};