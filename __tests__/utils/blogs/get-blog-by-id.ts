import request from 'supertest';
import { Express } from 'express';
import { BlogViewModel } from "../../../src/blogs/types/blog-view-model";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/consts/http-statuses';



export async function getBlogById(
    app: Express,
    blogId: string,
): Promise<BlogViewModel> {
    const blogResponse = await request(app)
        .get(`${BLOGS_PATH}/${blogId}`)
        .set('Authorization', generateBasicAuthToken())
        .expect(HttpStatus.Ok);

    return blogResponse.body
}