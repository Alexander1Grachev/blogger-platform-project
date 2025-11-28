import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { createPostForBlog } from '../../utils/blogs/create-post-for-blog';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { PostOutput } from '../../../src/posts/routers/output/post.output';

describe('', () => {
  const app = express();
  setupApp(app);
  let blogId: string;
  let createdPost: PostOutput;

  beforeAll(async () => {
    blogId = await createFirstBlog(app);
    createdPost = await createPostForBlog(app, blogId);
  });

  it('✅ should get post by blog id', async () => {
    const response = await request(app)
      .get(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
      .expect(HttpStatus.Ok);

    expect(response.body.data).toHaveLength(1); // массив из 1 поста
    expect(response.body.data[0]).toEqual(createdPost.data); // сравниваем первый пост
    expect(response.body.meta).toBeDefined(); // проверяем пагинацию
  });
});
