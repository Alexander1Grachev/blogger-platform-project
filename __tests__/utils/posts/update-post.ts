import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { PostInputDto } from "../../../src/posts/dto/post-input-model";

export async function updatePost(
    app: Express,
    postId: string,
    postDto: PostInputDto,
): Promise<void> {
    console.log('🛠️ UPDATE POST UTILITY:', {
        postId,
        postDto: {
            ...postDto,
            // Не логируем весь content если он большой
            content: postDto.content?.length > 50 ?
                postDto.content.substring(0, 50) + '...' :
                postDto.content
        }
    });

    const response = await request(app)
        .put(`${POSTS_PATH}/${postId}`)
        .set('Authorization', generateBasicAuthToken())
        .send(postDto);

    console.log('🛠️ UPDATE POST RESPONSE:', {
        status: response.status,
        body: response.body
    });

    if (response.status !== HttpStatus.NoContent) {
        throw new Error(`Expected 204 but got ${response.status}: ${JSON.stringify(response.body)}`);
    }
}