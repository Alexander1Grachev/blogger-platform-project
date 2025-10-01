import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { PostInputDto } from '../../../src/posts/dto/post-input-model';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';
import { createPost } from '../../utils/posts/create-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { getPostDto } from '../../utils/posts/get-post-dto';

describe('READ posts', () => {
  const app = express();
  setupApp(app);

  // Объявляем пременные
  let postId: string; // сохроняем id поста
  let blogId: string; // сохроняем id блога
  let correctPostData: PostInputDto

  beforeAll(async () => {

    blogId = await createFirstBlog(app)
    correctPostData = getPostDto(blogId);
    const createdPost = await createPost(app, blogId)
    postId = createdPost.id;
  });

  it('✅ should get post by id', async () => {
    const post = await getPostById(app, postId)
  
    expect(post).toMatchObject({
      id: postId,
      ...correctPostData,
      blogId: blogId,
      blogName: expect.any(String),
      createdAt: expect.any(String),

    });
  });

  it('✅ should get posts list with at least one post', async () => {
    const res = await request(app)
      .get(POSTS_PATH)
      .expect(HttpStatus.Ok);
    expect(res.body.length).toBeGreaterThanOrEqual(1); // список должен содержать минимум 1 блог
    expect(res.body[0].id).toBe(postId);// доп проверка на id
  });

  it('❌ should return 404 if post not found', async () => {
    await request(app)
      .get(`${POSTS_PATH}/68dd420a59b32c41bb039999`)
      .expect(HttpStatus.NotFound);
  });
});
