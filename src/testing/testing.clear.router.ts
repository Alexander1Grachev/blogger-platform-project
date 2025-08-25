import { Router, Request, Response } from 'express';
import { db } from '../db/in-memory.db';
import { HttpStatus } from '../core/consts/http-statuses';

export const testingClearRouter = Router();

testingClearRouter.delete('/all-data', (req: Request, res: Response) => {
  db.blogs = [];
  db.posts = [];

  res.sendStatus(HttpStatus.NoContent);
});
