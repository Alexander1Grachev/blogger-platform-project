import { Router, Request, Response } from 'express';
import { HttpStatus } from '../core/consts/http-statuses';

import { RateLimitModel } from '../infrastructure/rate-limit/rate-limit.model';
import { BlogModel } from '../blogs/domain/blog.entity';
import { PostModel } from '../posts/domain/post.entity';
import { UserModel } from '../users/domain/user.entity';
import { CommentModel } from '../comments/domain/comment.entity';
import { SessionModel } from '../security-devices/domain/session.entity';
import { LikeModel } from '../likes/domain/like.entity';
export const testingClearRouter = Router();

testingClearRouter.delete('/all-data', async (req: Request, res: Response) => {

  await Promise.all([
    BlogModel.deleteMany(),
    PostModel.deleteMany(),
    UserModel.deleteMany(),
    CommentModel.deleteMany(),
    SessionModel.deleteMany(),
    LikeModel.deleteMany(),
    RateLimitModel.deleteMany(),
  ])
  res.sendStatus(HttpStatus.NoContent);
});
