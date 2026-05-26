// @ts-nocheck
import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { getTestApp } from '../../setup/start-test-app';

describe('CREATE blog checks', () => {
  const app = getTestApp();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('❌ should not create blog without auth', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(getBlogDto())
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create blog with wrong auth', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .set(
        'Authorization',
        'Basic ' + Buffer.from('wrong:creds').toString('base64'),
      )
      .send(getBlogDto())
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
      });

    expect(invalidResponse.status).toBe(HttpStatus.BadRequest);

    // Проверяем, что поле errorsMessages существует и содержит 3 ошибки
    expect(invalidResponse.body.errorsMessages).toBeDefined();
    expect(invalidResponse.body.errorsMessages).toHaveLength(3);

    // check что никто не создался
    const blogList = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);
    expect(blogList.body.items).toHaveLength(0);
  });
  it('✅ should create blog with valid data & auth', async () => {
    const createdBlog = await createBlog(app);

    expect(createdBlog.id).toEqual(expect.any(String));
    expect(createdBlog.createdAt).toEqual(expect.any(String));
    expect(createdBlog.isMembership).toEqual(expect.any(Boolean));
  });
});
