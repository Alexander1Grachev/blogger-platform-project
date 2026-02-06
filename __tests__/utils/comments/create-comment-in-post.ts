
import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { COMMENT_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { CommentInputDto } from '../../../src/comments/application/dtos/comment-input.dto';
import { CommentViewModel } from '../../../src/comments/application/output/comment-view-model';
import { createPost } from '../posts/create-post';


export async function createComment(
  app: Express,
  accessToken: string,
  commentDto: CommentInputDto,
): Promise<CommentViewModel> {
  const post = await createPost(app);

  const postId = post.id;
  
  const createdCommentRes = await request(app)
    .post(`${POSTS_PATH}/${postId}${COMMENT_PATH}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(commentDto)
    .expect(HttpStatus.Created);

  return createdCommentRes.body;
}
