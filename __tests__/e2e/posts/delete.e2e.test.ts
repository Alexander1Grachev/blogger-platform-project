import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { createPost } from '../../utils/posts/create-post';
import { getTestApp } from '../../setup/start-test-app';

describe('DELETE post checks', () => {
  const app = getTestApp();

  const adminToken = generateBasicAuthToken();

  let postId: string;

  beforeAll(async () => {
    await clearDb(app);
    const post = await createPost(app);
    postId = post.data.id;
  });

  it('✅ should delete post with valid auth', async () => {
    await request(app)
      .delete(`${POSTS_PATH}/${postId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    // проверяем пост удалился
    await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .expect(HttpStatus.NotFound);
  });
});
