import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';

describe('READ blogs', () => {
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
    // создаем объект в
    const { body } = await request(app) // ссылка на поянение после кода НИЖЕ
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send(correctBlogData)
      .expect(HttpStatus.Created);
    createdBlogId = body.id; // сохраняем id для последующих тестов
  });
  afterAll(async () => {
    await clearDb(app); // чистим базу после всех тестов
  });

  
  it('✅ should get blog by id', async () => {
    const res = await request(app)
      .get(`${BLOGS_PATH}/${createdBlogId}`) // GET /blogs/:id
      .expect(HttpStatus.Ok);
    expect(res.body).toMatchObject({
      // проверяем, что вернулся тот же блог
      id: createdBlogId,
      ...correctBlogData,
    });
  });

  it('✅ should get blogs list with at least one blog', async () => {
    const res = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);
    expect(res.body.length).toBeGreaterThanOrEqual(1); // список должен содержать хотя бы 1 блог
  });

  it('❌ should return 404 if blog not found', async () => {
    await request(app)
      .get(`${BLOGS_PATH}/non-existing-id`) // несуществующий id
      .expect(HttpStatus.NotFound);
  });
});
