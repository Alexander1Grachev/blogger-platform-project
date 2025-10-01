import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';

import { BlogInputDto } from "../../../src/blogs/dto/blog-input-model";
import { getBlogDto } from './get-blog-dto';


export async function updateBlog(
    app: Express,
    blogId: string,
    blogDto?: BlogInputDto,
): Promise<void> {
    const defaultBlogData: BlogInputDto = getBlogDto()

    const testBlogData = { ...defaultBlogData, ...blogDto }

    const updatedBlogResponse = await request(app)
        .put(`${BLOGS_PATH}/${blogId}`)
        .set('Authorization', generateBasicAuthToken())
        .send(testBlogData)
        .expect(HttpStatus.NoContent)

    return updatedBlogResponse.body;


}