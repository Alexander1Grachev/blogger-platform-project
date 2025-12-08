import express, { Express } from 'express';

import { blogsRouter } from './blogs/routers/blogs.router';
import { postsRouter } from './posts/routers/posts.router';

import { testingClearRouter } from './testing/testing.clear.router';
import {
  BLOGS_PATH,
  POSTS_PATH,
  TESTING_CLEAR_PATH,
} from './core/paths/paths';

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса


  // Подключаем роуты
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);

  app.use(TESTING_CLEAR_PATH, testingClearRouter);
  return app;
};
