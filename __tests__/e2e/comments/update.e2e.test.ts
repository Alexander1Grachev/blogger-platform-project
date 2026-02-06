import request from 'supertest';

import { getTestApp } from "../../setup/start-test-app"
import { clearDb } from "../../utils/clear-db";
import { getCommentDto } from '../../utils/comments/get-comment-dto';
import { createComment } from '../../utils/comments/create-comment-in-post';
import { getUserDto } from '../../utils/users/get-user-dto';
import { createUserAndLogin } from '../../utils/create-user-n-login.token';
import { AUTH_PATH, COMMENT_PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/consts/http-statuses';



describe('UPDATE comment', () => {
  const app = getTestApp();
  let commentId: string;
  let accessTokenOwner: string;
  let accessTokenOther: string;

  beforeAll(async () => {
    await clearDb(app);

    const userOwner = getUserDto();
    const loginResOwner = await createUserAndLogin(app, userOwner);
    accessTokenOwner = loginResOwner.accessToken;

    const userOther = getUserDto();
    const loginResOther = await createUserAndLogin(app, userOther);
    accessTokenOther = loginResOther.accessToken;

    const commentDto = getCommentDto();
    const comment = await createComment(app, accessTokenOwner, commentDto);
    commentId = comment.id;
  });

  it('❌ should return 401 if not authenticated', async () => {
    await request(app)
      .put(`${COMMENT_PATH}/${commentId}`)
      .send(getCommentDto())
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should return 403 if trying to update someone elses comment', async () => {
    await request(app)
      .put(`${COMMENT_PATH}/${commentId}`)
      .set('Authorization', `Bearer ${accessTokenOther}`)
      .send(getCommentDto())
      .expect(HttpStatus.Forbidden);
  });

  it('❌ should return 404 if comment does not exist', async () => {
    await request(app)
      .put(`${COMMENT_PATH}/999999999999999999999999`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send(getCommentDto())
      .expect(HttpStatus.NotFound);
  });

  it('❌ should return 400 if inputModel is invalid', async () => {
    await request(app)
      .put(`${COMMENT_PATH}/${commentId}`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send({ content: 'short' })
      .expect(HttpStatus.BadRequest);
  });

  it('✅ should update comment  by id (owner)', async () => {
    const edit = getCommentDto();
    await request(app)
      .put(`${COMMENT_PATH}/${commentId}`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send(edit)
      .expect(HttpStatus.NoContent);

    const me = await request(app)
      .get(`${AUTH_PATH}/me`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .expect(HttpStatus.Ok)

    const res = await request(app)
      .get(`${COMMENT_PATH}/${commentId}`)
    expect(res.body).toMatchObject({
      id: commentId,
      content: edit.content,
      commentatorInfo: {
        userId: me.body.userId,
        userLogin: me.body.login,
      },
      createdAt: expect.any(String),
    })
  });
})