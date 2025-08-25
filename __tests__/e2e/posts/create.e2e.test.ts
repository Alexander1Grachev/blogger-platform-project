import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { PostInputDto } from '../../../src/posts/dto/post-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';

describe('CREATE post check', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  const correctPostData: PostInputDto = {
    title: 'Green Tea Benefits',
    shortDescription: 'A short overview of green tea advantages',
    content:
      'Green tea is rich in antioxidants and has many health benefits...',
    blogId: '',
  };
``
  // Объявляем пременные
  let inputBlogId: string; // сохроняем id блога
  let inputBlogName: string; // сохроняем name блога

  beforeAll(async () => {
    await clearDb(app); // создаём блог и сохраняем его id

    // 1.Создаем блог
    const { body: blog } = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: 'Tea blog',
        description: 'About tea and tea culture',
        websiteUrl: 'https://example.com/path',
      })
      .expect(HttpStatus.Created);

    inputBlogId = blog.id;
    inputBlogName = blog.name; 
    correctPostData.blogId = inputBlogId; 
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
    const res = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken) 
      .send(correctPostData) 
      .expect(HttpStatus.Created);

    expect(res.body).toMatchObject({
      id: expect.any(String), // id строка
      title: correctPostData.title,
      shortDescription: correctPostData.shortDescription,
      content: correctPostData.content,
      blogId: inputBlogId,
      blogName: inputBlogName,
    });
  });
});
