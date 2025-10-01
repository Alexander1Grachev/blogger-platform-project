import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';

describe('DELETE blog checks', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();


  let blogId: string;

  beforeAll(async () => {
    blogId = await createFirstBlog(app);
  });



  it('✅ should delete blog with valid auth', async () => {
    await request(app)
      .delete(`${BLOGS_PATH}/${blogId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${BLOGS_PATH}/${blogId}`)
      .expect(HttpStatus.NotFound);
  });
});
