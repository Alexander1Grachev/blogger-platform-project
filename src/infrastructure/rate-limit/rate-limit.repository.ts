import { rateLimitCollection } from "../db/mongo.db"
import { RateLimitLog } from "./rate-limit.model";




export const rateLimitRepository = {
  async countRequests(ip: string, url: string): Promise<number> {
    const windowStart = new Date(Date.now() - 10_000)//10_000

    const filter = {
      IP: ip,        
      URL: url,     
      date: {       
        $gte: windowStart 
      }
    }
    const count = await rateLimitCollection.countDocuments(filter);
    console.log(`[rateLimitRepository] 📊  Count result: ${count} req in last 15s | IP: ${ip} | URL: ${url}`);
    return count
  },

  async createRequest(newRateLimitLog: RateLimitLog): Promise<void> {

    await rateLimitCollection.insertOne(newRateLimitLog);

  }
}