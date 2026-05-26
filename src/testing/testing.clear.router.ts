import { Router, Request, Response } from 'express';
import { HttpStatus } from '../core/consts/http-statuses';
import { UserModel } from '../users/repositories/models/user.model';
import { BlogModel } from '../blogs/repositories/models/blog.model';
import { PostModel } from '../posts/reposytories/models/post.model';
import { CommentModel } from '../comments/repositories/models/comments.model';
import { SessionModel } from '../security-devices/repositories/models/session.model';
import { RateLimitModel } from '../infrastructure/rate-limit/rate-limit.model';
export const testingClearRouter = Router();

testingClearRouter.delete('/all-data', async (req: Request, res: Response) => {

  await Promise.all([
    BlogModel.deleteMany(),
    PostModel.deleteMany(),
    UserModel.deleteMany(),
    CommentModel.deleteMany(),
    SessionModel.deleteMany(),
    RateLimitModel.deleteMany(),
  ])
  res.sendStatus(HttpStatus.NoContent);
});
