import request from 'supertest';

import { getTestApp } from "../../setup/start-test-app"
import { clearDb } from "../../utils/clear-db";
import { getCommentDto } from '../../utils/comments/get-comment-dto';
import { createComment } from '../../utils/comments/create-comment-in-post';
import { getUserDto } from '../../utils/users/get-user-dto';
import { createUserAndLogin } from '../../utils/users/create-user-n-login.token';
import { COMMENT_PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/consts/http-statuses';



describe('UPDATE comment like-status', () => {
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
      .put(`${COMMENT_PATH}/${commentId}/like-status`)
      .set('Authorization', `Bearer invalidtoken123`)
      .send({ likeStatus: "Like" })
      .expect(HttpStatus.Unauthorized)
  });

  it('❌ should return 404 if comment does not exist', async () => {
    // сценарий где я подаю не нушествующий commentId 
    const fakeCommentId = '66efeaadeb3dafea3c3971fb';
    await request(app)
      .put(`${COMMENT_PATH}/${fakeCommentId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send({ likeStatus: "Like" })
      .expect(HttpStatus.NotFound)
  });

  it('❌ should return 400 if inputModel is invalid', async () => {
    await request(app)
      .put(`${COMMENT_PATH}/${commentId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send({ likeStatus: "invalid" })
      .expect(HttpStatus.BadRequest)
  });

  it('✅ should update comment like-status by id (owner)', async () => {
    await request(app)
      .put(`${COMMENT_PATH}/${commentId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send({ likeStatus: "Dislike" })
      .expect(HttpStatus.NoContent)

    const res = await request(app)
      .get(`${COMMENT_PATH}/${commentId}`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)

    expect(res.body.likesInfo.myStatus).toBe('Dislike')
  })

  it('✅ should return 204 if not authenticated (no action)', async () => {
    // вход без авторизации
    await request(app)
      .put(`${COMMENT_PATH}/${commentId}/like-status`)
      .send({ likeStatus: "Dislike" })
      .expect(HttpStatus.NoContent)
  })

  it('✅ should increment likesInfo two users like same comment', async () => {

    await request(app)
      .put(`${COMMENT_PATH}/${commentId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .send({ likeStatus: "Like" })
      .expect(HttpStatus.NoContent)

    await request(app)
      .put(`${COMMENT_PATH}/${commentId}/like-status`)
      .set('Authorization', `Bearer ${accessTokenOther}`)
      .send({ likeStatus: "Like" })
      .expect(HttpStatus.NoContent)

    const res = await request(app)
      .get(`${COMMENT_PATH}/${commentId}`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)

    expect(res.body.likesInfo.likesCount).toBe(2)
    expect(res.body.likesInfo.dislikesCount).toBe(0)
  })
})