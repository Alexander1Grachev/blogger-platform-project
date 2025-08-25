import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { PostInputDto } from '../../../src/posts/dto/post-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';

describe('UPDATE posts', () => {
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
  });

      afterAll(async () => {
      await clearDb(app);
    });

  it('❌ should not update post with invalid body', async () => {
    const invalidUpdate = await request(app)
      .put(`${POSTS_PATH}/${createdPostId}`)
      .set('Authorization', adminToken)
      .send({
        title: ' ',
        shortDescription: 'a'.repeat(200),
        content: 'a'.repeat(1100),
        blogId: 123,
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidUpdate.body.errorMessages).toHaveLength(4);
  });
  

  it('✅ should update post with valid data', async () => {
    const updatedPost: PostInputDto = {
      title: 'Updated title',
      shortDescription: 'Updated shortDescription',
      content: 'Updated content',
      blogId: inputBlogId,
    };

    await request(app)
      .put(`${POSTS_PATH}/${createdPostId}`)
      .set('Authorization', adminToken)
      .send(updatedPost)
      .expect(HttpStatus.NoContent); // 204 — успешное обновление
    // проверка обновился пост?

    const res = await request(app)
      .get(`${POSTS_PATH}/${createdPostId}`)
      .expect(HttpStatus.Ok);

    expect(res.body).toMatchObject({
      id: createdPostId,
      ...updatedPost,
    });
  });
});
