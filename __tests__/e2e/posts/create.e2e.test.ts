import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { PostInputDto } from '../../../src/posts/dto/post-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';

describe('CREATE post check', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  // Объявляем пременные
  let blogId: string; // сохроняем id блога
  let correctPostData: PostInputDto

  beforeAll(async () => {
    blogId = await createFirstBlog(app)

    // Создаем данные для поста с правильным blogId
    correctPostData = getPostDto(blogId); // Передаем blogId в утилиту
});

it('❌ should not create post without auth', async () => {
  await request(app)
    .post(POSTS_PATH)
    .send(correctPostData)
    .expect(HttpStatus.Unauthorized);
});

it('❌ should not create post with wrong auth', async () => {
  await request(app)
    .post(POSTS_PATH)
    .set(
      'Authorization', 'Basic ' + Buffer
        .from('wrong:creds').toString('base64'),
    )
    .send(correctPostData)
    .expect(HttpStatus.Unauthorized);
});

it('❌ should not create post with invalid body', async () => {
  const invalidResponse = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', adminToken)
    .send({
      title: ' ',
      shortDescription: 'a'.repeat(200),
      content: 'a'.repeat(1100),
      blogId: 123,
    })
    .expect(HttpStatus.BadRequest);

  expect(invalidResponse.body.errorsMessages).toHaveLength(4);

  const PostList = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);
  expect(PostList.body).toHaveLength(0);
});

it('✅ should create post with valid data & auth', async () => {
  const createdBlog = await createPost(app,blogId,correctPostData)


  expect(createdBlog).toMatchObject({
    id: expect.any(String), // id строка
    title: correctPostData.title,
    shortDescription: correctPostData.shortDescription,
    content: correctPostData.content,
    blogId: blogId,
    blogName: expect.any(String),
    createdAt: expect.any(String),
  });
});
});
