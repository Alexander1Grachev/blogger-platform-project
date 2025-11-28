import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { correctTestBlogData } from '../../utils/blogs/get-blog-dto';
import { createBlog } from '../../utils/blogs/create-blog';
import { ResourceType } from '../../../src/core/consts/resource-type';

describe('CREATE blog checks', () => {
  const app = express();
  setupApp(app);
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('❌ should not create blog without auth', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create blog with wrong auth', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .set(
        'Authorization',
        'Basic ' + Buffer.from('wrong:creds').toString('base64'),
      )
      .send(correctTestBlogData)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create blog with invalid body', async () => {
    const invalidResponse = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestBlogData.data,
          attributes: {
            name: ' ',
            description: 'a'.repeat(600),
            websiteUrl: 'invalid-url',
          },
        },
      });
    // УБРАЛ!!1 .expect(HttpStatus.BadRequest) отсюда

    expect(invalidResponse.status).toBe(HttpStatus.BadRequest); // ЗАМЕНА ПРОВЕРКИ СТАТУСА

    expect(invalidResponse.body.errors).toHaveLength(3);

    // check что никто не создался
    const blogList = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);
    expect(blogList.body.data).toHaveLength(0); // теперь body имеет структуру { data: [], meta:
  });

  it('✅ should create blog with valid data & auth', async () => {
    const createdBlog = await createBlog(app);

    const result = createdBlog.data;
    expect(result.type).toBe(ResourceType.Blogs);
    expect(result.id).toEqual(expect.any(String));
    expect(result.attributes.createdAt).toEqual(expect.any(String));
    expect(result.attributes.isMembership).toEqual(expect.any(Boolean));
  });
});
