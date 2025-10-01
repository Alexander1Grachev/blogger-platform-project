import { Router, Request, Response } from 'express';
import { db } from '../db/in-memory.db';
import { HttpStatus } from '../core/consts/http-statuses';
import { blogCollection, postCollection } from '../db/mongo.db';

export const testingClearRouter = Router();

testingClearRouter.delete('/all-data', async (req: Request, res: Response) => {

  await Promise.all([
    blogCollection.deleteMany(),
    postCollection.deleteMany(),

  ])
  res.sendStatus(HttpStatus.NoContent);
});
