import request from 'supertest';

import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { clearDb } from "../../utils/clear-db";
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { getTestApp } from '../../setup/start-test-app';

describe('READ blogs', () => {
  const app = getTestApp();


  let blogId: string;

  beforeAll(async () => {
    await clearDb(app);

    const blog = await createBlog(app);
    blogId = blog.id
  });

  it('✅ should get blog by id', async () => {
    const blog = await getBlogById(app, blogId);
    expect(blog).toMatchObject({
      // проверяем, что вернулся тот же блог
      ...getBlogDto(),
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });

  it('✅ should get blogs list with at least one blog', async () => {
    await createBlog(app);
    const res = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);

    expect(res.body.items.length).toBeGreaterThanOrEqual(2); // список должен содержать хотя бы 2 блога
  });

  it('❌ should return 404 if blog not found', async () => {
    await request(app)
      .get(`${BLOGS_PATH}/68dd420a59b32c41bb039999`) // несуществующий id
      .expect(HttpStatus.NotFound);
  });
});
