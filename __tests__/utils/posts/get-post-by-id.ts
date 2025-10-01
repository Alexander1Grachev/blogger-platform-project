import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from "../../../src/core/consts/http-statuses";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { PostViewModel } from "../../../src/posts/types/post-view-model";
import { generateBasicAuthToken } from "../generate-admin-auth-token";


export async function getPostById<P = PostViewModel>(
    app: Express,
    postId: string,
    expectedStatus?: HttpStatus,
): Promise<P> {
    const testStatus = expectedStatus ?? HttpStatus.Ok;

    const getResponse = await request(app)
        .get(`${POSTS_PATH}/${postId}`)
        .set('Authorization', generateBasicAuthToken())
        .expect(testStatus)

    return getResponse.body
}