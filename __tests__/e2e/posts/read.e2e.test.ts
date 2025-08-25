import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { PostInputDto } from '../../../src/posts/dto/post-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';

describe('READ posts', () => {
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

  // Объявляем пременные
  let createdPostId: string; // сохроняем id поста
  let inputBlogId: string; // сохроняем id блога
  let inputBlogName: string; //сохроняем name блога

  beforeAll(async () => {
    await clearDb(app);

    // 1.Создаём блог
    const blogRes = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: 'Tea Blog',
        description: 'All about tea',
        websiteUrl: 'https://tea.example.com',
      })
      .expect(HttpStatus.Created);

    inputBlogId = blogRes.body.id;
    inputBlogName = blogRes.body.name;

    // 2.Создаем пост для ранее созданного блога
    const res = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctPostData,
        blogId: inputBlogId,
      })
      .expect(HttpStatus.Created);

    createdPostId = res.body.id;

    // 3.Проверка, что всё сохранено верно
    expect(res.body).toMatchObject({
      id: expect.any(String),
      title: correctPostData.title,
      shortDescription: correctPostData.shortDescription,
      content: correctPostData.content,
      blogId: inputBlogId,
      blogName: inputBlogName,
    });
  });

  afterAll(async () => {
    await clearDb(app);
  });

  it('✅ should get post by id', async () => {
    const res = await request(app)
      .get(`${POSTS_PATH}/${createdPostId}`)
      .expect(HttpStatus.Ok);

    expect(res.body).toMatchObject({
      id: createdPostId,
      ...correctPostData,
      blogId: inputBlogId,
      blogName: inputBlogName,
    });
  });

  it('✅ should get posts list with at least one post', async () => {
    const res = await request(app)
      .get(POSTS_PATH)
      .send(correctPostData)
      .expect(HttpStatus.Ok);
    expect(res.body.length).toBeGreaterThanOrEqual(1); // список должен содержать минимум 1 блог
  });

  it('❌ should return 404 if post not found', async () => {
    await request(app)
      .get(`${POSTS_PATH}/non-existing-id`)
      .expect(HttpStatus.NotFound);
  });
});
