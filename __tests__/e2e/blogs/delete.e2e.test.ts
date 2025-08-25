import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';

describe('DELETE blog checks', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  const correctBlogData: BlogInputDto = {
    name: 'Tea blog',
    description: 'About tea and tea culture',
    websiteUrl: 'https://example.com/path',
  };

  let createdBlogId: string;

  beforeAll(async () => {
    await clearDb(app);
    const { body } = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send(correctBlogData)
      .expect(HttpStatus.Created);

    createdBlogId = body.id;
  });

  afterAll(async () => {
    await clearDb(app);
  });

  it('✅ should delete blog with valid auth', async () => {
    await request(app)
      .delete(`${BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent); 

    await request(app)
      .get(`${BLOGS_PATH}/${createdBlogId}`)
      .expect(HttpStatus.NotFound);
  });
});
