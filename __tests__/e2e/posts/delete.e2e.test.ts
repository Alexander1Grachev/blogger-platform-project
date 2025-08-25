import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { PostInputDto } from '../../../src/posts/dto/post-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';

describe('DELETE post checks', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  const makePost = (blogId: string): PostInputDto => ({
    title: 'Green Tea Benefits',
    shortDescription: 'A short overview of green tea advantages',
    content: 'Green tea is rich in antioxidants and has many health benefits...',
    blogId,
  });

  let createdPostId: string;
  let inputBlogId: string;

  beforeAll(async () => {
    await clearDb(app);

    // 1) Создаём блог
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

    // 2) Создаём пост для этого блога
    const postRes = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send(makePost(inputBlogId))
      .expect(HttpStatus.Created);

    createdPostId = postRes.body.id;
  });

  afterAll(async () => {
    await clearDb(app);
  });

  it('✅ should delete post with valid auth', async () => {
    await request(app)
      .delete(`${POSTS_PATH}/${createdPostId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${POSTS_PATH}/${createdPostId}`)
      .expect(HttpStatus.NotFound);
  });
});
