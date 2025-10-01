import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from "../../../src/core/consts/http-statuses";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { PostInputDto } from "../../../src/posts/dto/post-input-model";
import { PostViewModel } from "../../../src/posts/types/post-view-model";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { getPostDto } from './get-post-dto';




export async function createPost(
    app: Express,
    blogId: string,
    postDto?: PostInputDto,
): Promise<PostViewModel> {

    const defaultPostData = getPostDto(blogId)

    const testPostData = { ...defaultPostData, ...postDto }

    const createdPostResponse = await request(app)
        .post(POSTS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(testPostData)
        .expect(HttpStatus.Created);

    return createdPostResponse.body;
}