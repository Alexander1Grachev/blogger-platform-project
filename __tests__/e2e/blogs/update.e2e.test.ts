import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';

describe('UPDATE blog checks', () => {
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
// создаем новый объект для обновления
    const { body } = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send(correctBlogData)
      .expect(HttpStatus.Created);

    createdBlogId = body.id;
  });

  afterAll(async () => {
    await clearDb(app); // чистим базу после всех тестов
  });

  it('❌ should not update blog with invalid body', async () => {
    const invalidUpdate = await request(app)
      .put(`${BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send({
        name: '   ', // пустое имя
        description: '', // пустое описание
        websiteUrl: 'http://wrong.com', // должен быть https
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidUpdate.body.errorsMessages).toHaveLength(3);
  });

  it('✅ should update blog with valid data', async () => {
    const updatedBlog: BlogInputDto = {
      name: 'UpdatedBlog',
      description: 'New description',
      websiteUrl: 'https://updated.com',
    };

    await request(app)
      .put(`${BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send(updatedBlog)
      .expect(HttpStatus.NoContent); // 204 — успешное обновление


    // проверяем, что блог реально обновился
    const res = await request(app)
      .get(`${BLOGS_PATH}/${createdBlogId}`)
      .expect(HttpStatus.Ok);
    expect(res.body).toMatchObject({
      id: createdBlogId,
      ...updatedBlog,
    });
  });
});
