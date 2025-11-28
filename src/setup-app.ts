import express, { Express } from 'express';

import { blogsRouter } from './blogs/routers/blogs.router';
import { postsRouter } from './posts/routers/posts.router';

import { testingClearRouter } from './testing/testing.clear.router';
import { BLOGS_PATH, POSTS_PATH, TESTING_CLEAR_PATH } from './core/paths/paths';
import {
  jsonApiAdapterMiddleware,
  responseAdapterMiddleware,
} from './core/middlewares/json-api-adapter.middleware';

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса
  app.use(jsonApiAdapterMiddleware); //  body-parser чтобы принимать плоский JSON 
  app.use(responseAdapterMiddleware); //  body-parser чтобы посылать плоский JSON 

  // Подключаем роуты
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_CLEAR_PATH, testingClearRouter);
  return app;
};
