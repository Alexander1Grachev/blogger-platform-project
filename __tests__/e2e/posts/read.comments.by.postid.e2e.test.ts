import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { COMMENT_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { clearDb } from '../../utils/clear-db';

import { getTestApp } from '../../setup/start-test-app';
import { createUserAndLogin } from '../../utils/users/create-user-n-login.token';
import { getUserDto } from '../../utils/users/get-user-dto';
import { getCommentDto } from '../../utils/comments/get-comment-dto';
import { createComment } from '../../utils/comments/create-comment-in-post';
import { createPost } from '../../utils/posts/create-post';


describe('GET post comments', () => {
  const app = getTestApp();
  let postId: string;
  let commentId: string;
  let accessTokenOwner: string;

  beforeAll(async () => {
    await clearDb(app);
    const userOwner = getUserDto();
    const loginResOwner = await createUserAndLogin(app, userOwner);
    accessTokenOwner = loginResOwner.accessToken;

    const post = await createPost(app);
    postId = post.id;

    const comment = await createComment(app, accessTokenOwner, getCommentDto(), postId);
    commentId = comment.id;
  });

  it('❌ should return 404 if post does not exist', async () => {
    const fakePostId = '66efeaadeb3dafea3c3971fb';
    await request(app)
      .get(`${POSTS_PATH}/${fakePostId}/comments`)
      .expect(HttpStatus.NotFound);
  });

  it('✅ should return comments with myStatus None for unauthorized', async () => {
    const res = await request(app)
      .get(`${POSTS_PATH}/${postId}/comments`)
      .expect(HttpStatus.Ok);

    expect(res.body.items[0].likesInfo.myStatus).toBe('None');
  });

  it('✅ should return correct myStatus for authorized user', async () => {
    await request(app)
      .put(`${COMMENT_PATH}/${commentId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send({ likeStatus: 'Like' });

    const res = await request(app)
      .get(`${POSTS_PATH}/${postId}/comments`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .expect(HttpStatus.Ok);

    expect(res.body.items[0].likesInfo.myStatus).toBe('Like');
    expect(res.body.items[0].likesInfo.likesCount).toBe(1);
  });

  it('✅ should return pagination fields', async () => {
    const res = await request(app)
      .get(`${POSTS_PATH}/${postId}/comments`)
      .expect(HttpStatus.Ok);

    expect(res.body).toMatchObject({
      pagesCount: expect.any(Number),
      page: expect.any(Number),
      pageSize: expect.any(Number),
      totalCount: expect.any(Number),
      items: expect.any(Array),
    });
  });
});