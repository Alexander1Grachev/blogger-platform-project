import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { createPost } from '../../utils/posts/create-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { clearDb } from '../../utils/clear-db';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '../../../src/core/consts/pagination-and-sorting.default';
import { getTestApp } from '../../setup/start-test-app';

describe('READ posts', () => {
  const app = getTestApp();

  let postId: string;
  let createdPost: PostOutput;

  beforeAll(async () => {
    await clearDb(app);
    createdPost = await createPost(app);
    postId = createdPost.data.id;
  });

  it('✅ should get post by id', async () => {
    const post = await getPostById(app, postId);

    //cравниваем с ПОЛНЫМ объектом, который вернул сервер
    expect(post).toEqual(createdPost);
  });

  it('✅ should get posts list with at least one post', async () => {
    await createPost(app);

    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    // Базовая проверка структуры
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.meta).toBeDefined();

    // Проверка согласованности данных и пагинации
    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta.totalCount).toBe(2);
    expect(response.body.meta.page).toBe(DEFAULT_PAGE_NUMBER);
    expect(response.body.meta.pageSize).toBe(DEFAULT_PAGE_SIZE);
    expect(response.body.meta.pageCount).toBe(1); // 2/10 = 1 страница
  });

  it('✅ should handle mitiple pages', async () => {
    //Создаем 13 постов (+2 что уже есть) = 15
    for (let i = 0; i < 13; i++) {
      await createPost(app);
    }

    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    expect(response.body.meta.totalCount).toBe(15);
    expect(response.body.meta.pageCount).toBe(2); // 15/10 = 2 страницы
    expect(response.body.data).toHaveLength(10); // первая страница = 10 постов
  });

  it('✅ should respect custom pageSize', async () => {
    const response = await request(app)
      .get(`${POSTS_PATH}?pageSize=5`)
      .expect(HttpStatus.Ok);

    expect(response.body.meta.pageSize).toBe(5);
    expect(response.body.data).toHaveLength(5); // 5 постов на странице
  });

  it('✅ should respect page parameter', async () => {
    const response = await request(app)
      .get(`${POSTS_PATH}?pageNumber=2&pageSize=5`)
      .expect(HttpStatus.Ok);

    expect(response.body.meta.page).toBe(2);
    expect(response.body.meta.pageSize).toBe(5);
    // На второй странице должны быть посты с 6 по 10
  });

  it('✅ should return empty array when no posts ', async () => {
    await clearDb(app);
    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    expect(response.body.data).toHaveLength(0);
    expect(response.body.meta.pageCount).toBe(0);
    expect(response.body.meta.totalCount).toBe(0);
  });

  it('❌ should return 404 if post not found', async () => {
    await request(app)
      .get(`${POSTS_PATH}/68dd420a59b32c41bb039999`)
      .expect(HttpStatus.NotFound);
  });
});
