import express, { Express } from 'express';

import { blogsRouter } from './blogs/routers/blogs.router';
import { postsRouter } from './posts/routers/posts.router';

import { testingClearRouter } from './testing/testing.clear.router';
import {
  AUTH_PATH,
  BLOGS_PATH,
  COMMENT_PATH,
  POSTS_PATH,
  TESTING_CLEAR_PATH,
  USERS_PATH,
} from './core/paths/paths';
import { usersRouter } from './users/routers/users.router';
import { authRouter } from './auth/routers/auth.router';
import { commentsRouter } from './comments/routers/comments.router';

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса


  // Подключаем роуты
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(AUTH_PATH, authRouter);
  app.use(COMMENT_PATH, commentsRouter);



  app.use(TESTING_CLEAR_PATH, testingClearRouter);
  return app;
};
