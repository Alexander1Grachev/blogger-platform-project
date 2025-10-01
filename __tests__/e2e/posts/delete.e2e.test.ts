import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { PostInputDto } from '../../../src/posts/dto/post-input-model';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';
import { createPost } from '../../utils/posts/create-post';
import { getPostById } from '../../utils/posts/get-post-by-id';

describe('DELETE post checks', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  let postId: string;
  let blogId: string;

  beforeAll(async () => {

    blogId = await createFirstBlog(app)
    const createdPost = await createPost(app, blogId)

    postId = createdPost.id;
  });


  it('✅ should delete post with valid auth', async () => {

    await request(app)
      .delete(`${POSTS_PATH}/${postId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await getPostById(app, postId, HttpStatus.NotFound)

  });
});
