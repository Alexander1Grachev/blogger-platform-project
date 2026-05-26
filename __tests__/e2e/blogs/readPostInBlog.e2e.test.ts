import request from 'supertest';

import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { createPostForBlog } from '../../utils/blogs/create-post-for-blog';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { createBlog } from '../../utils/blogs/create-blog';
import { clearDb } from '../../utils/clear-db';
import { PostViewModel } from '../../../src/posts/application/output/post-view-model';
import { getTestApp } from '../../setup/start-test-app';

describe('', () => {
  const app = getTestApp();

  let blogId: string;
  let createdPost: PostViewModel;

  beforeAll(async () => {
    await clearDb(app)
    const blog = await createBlog(app);
    blogId = blog.id
    createdPost = await createPostForBlog(app, blogId);
  });

  it('✅ should get post by blog id', async () => {
    const response = await request(app)
      .get(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
      .expect(HttpStatus.Ok);

    expect(response.body.items).toHaveLength(1); // массив из 1 поста
    expect(response.body.items[0]).toEqual(createdPost); // сравниваем первый пост
    expect(response.body.totalCount).toBe(1); // проверяем общее количество
    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(10);
  });
});
