import request from 'supertest';
import { getTestApp } from "../../setup/start-test-app"
import { clearDb } from "../../utils/clear-db";
import { HttpStatus } from "../../../src/core/consts/http-statuses";
import { COMMENT_PATH } from "../../../src/core/paths/paths";
import { CommentViewModel } from '../../../src/comments/application/output/comment-view-model';
import { createComment } from '../../utils/comments/create-comment-in-post';
import { getCommentDto } from '../../utils/comments/get-comment-dto';
import { getUserDto } from '../../utils/users/get-user-dto';
import { createUserAndLogin } from '../../utils/users/create-user-n-login.token';

describe('GET comment by id', () => {
  const app = getTestApp();
  let commentId: string;
  let comment: CommentViewModel;
  let accessTokenOwner: string;
  beforeAll(async () => {
    await clearDb(app);

    const userOwner = getUserDto();
    const loginResOwner = await createUserAndLogin(app, userOwner);
    accessTokenOwner = loginResOwner.accessToken;

    comment = await createComment(app, accessTokenOwner, getCommentDto());
    commentId = comment.id
  });

  it('✅ should return comment by id', async () => {
    const res = await request(app)
      .get(`${COMMENT_PATH}/${commentId}`)
      .expect(HttpStatus.Ok);

    expect(res.body).toEqual({
      id: commentId,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: expect.any(String),
    });
  });

  it('❌ should return 404 if comment does not exist', async () => {
    await request(app)
      .get(`${COMMENT_PATH}/507f1f77bcf86cd799439011`)
      .expect(HttpStatus.NotFound);
  });

});