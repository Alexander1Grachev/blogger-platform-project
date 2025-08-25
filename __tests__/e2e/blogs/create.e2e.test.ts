import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';


describe('CREATE blog checks', () => {
  const app = express();
  setupApp(app);
  const adminToken = generateBasicAuthToken();
  const correctBlogData: BlogInputDto = {
    name: 'Tea blog',
    description: 'About tea and tea culture',
    websiteUrl: 'https://example.com/path',
  };

  beforeAll(async () => {
    await clearDb(app);
  });
    afterAll(async () => {
    await clearDb(app); // чистим базу после всех тестов
  });

  it('❌ should not create blog without auth', async () => {
    await request(app).post(BLOGS_PATH).send(correctBlogData).expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create blog with wrong auth', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', 'Basic ' + Buffer.from('wrong:creds').toString('base64'))
      .send(correctBlogData)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create blog with invalid body', async () => {
    const invalidResponse = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: ' ',
        description: 'a'.repeat(600),
        websiteUrl: 'invalid-url',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidResponse.body.errorMessages).toHaveLength(3);

    const blogList = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);
    expect(blogList.body).toHaveLength(0);
  });

  it('✅ should create blog with valid data & auth', async () => {
    const res = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send(correctBlogData)
      .expect(HttpStatus.Created);

    expect(res.body).toMatchObject({
      id: expect.any(String),
      ...correctBlogData,
    });
  });
});