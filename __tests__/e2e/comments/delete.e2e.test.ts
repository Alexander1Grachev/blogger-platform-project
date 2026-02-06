import request from 'supertest';
import { getTestApp } from '../../setup/start-test-app';
import { clearDb } from '../../utils/clear-db';
import { COMMENT_PATH } from '../../../src/core/paths/paths';
import { createUserAndLogin } from '../../utils/create-user-n-login.token';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { createComment } from '../../utils/comments/create-comment-in-post';
import { getCommentDto } from '../../utils/comments/get-comment-dto';
import { getUserDto } from '../../utils/users/get-user-dto';



describe('DELETE Comment by postId', () => {
  const app = getTestApp()
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
      .delete(`${COMMENT_PATH}/${commentId}`)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should return 403 if trying to delete someone else’s comment', async () => {
    await request(app)
      .delete(`${COMMENT_PATH}/${commentId}`)
      .set('Authorization', `Bearer ${accessTokenOther}`)
      .expect(HttpStatus.Forbidden);
  });

  it('❌ should return 404 if comment does not exist', async () => {
    const fakeId = '000000000000000000000000';
    await request(app)
      .delete(`${COMMENT_PATH}/${fakeId}`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .expect(HttpStatus.NotFound);
  });

  it('✅ should delete comment by id (owner)', async () => {
    await request(app)
      .delete(`${COMMENT_PATH}/${commentId}`)
      .set('Authorization', `Bearer ${accessTokenOwner}`)
      .expect(HttpStatus.NoContent)

    await request(app)
      .get(`${COMMENT_PATH}/${commentId}`)
      .expect(HttpStatus.NotFound);
  });


});