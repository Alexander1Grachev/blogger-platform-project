import { Router, Request, Response } from 'express';
import { HttpStatus } from '../core/consts/http-statuses';
import {
  blogCollection,
  commentCollection,
  postCollection,
  rateLimitCollection,
  sessionCollection,
  userCollection
} from '../infrastructure/db/mongo.db';

export const testingClearRouter = Router();

testingClearRouter.delete('/all-data', async (req: Request, res: Response) => {

  await Promise.all([
    blogCollection.deleteMany(),
    postCollection.deleteMany(),
    userCollection.deleteMany(),
    commentCollection.deleteMany(),
    sessionCollection.deleteMany(),
    rateLimitCollection.deleteMany(),

  ])
  res.sendStatus(HttpStatus.NoContent);
});
