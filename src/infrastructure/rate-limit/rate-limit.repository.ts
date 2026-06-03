import { IRateLimit, RateLimitModel } from "./rate-limit.model";
import { injectable } from "inversify";


@injectable()
export class RateLimitRepository {
  async countRequests(ip: string, url: string): Promise<number> {
    const windowStart = new Date(Date.now() - 10_000)//10_000

    const filter = {
      IP: ip,
      URL: url,
      date: {
        $gte: windowStart
      }
    }
    const count = await RateLimitModel.countDocuments(filter);
    // console.log(`[rateLimitRepository] 📊  Count result: ${count} req in last 10s | IP: ${ip} | URL: ${url}`);
    return count
  }

  async createRequest(newRateLimitLog: IRateLimit): Promise<void> {

    await RateLimitModel.create(newRateLimitLog);
  }
}