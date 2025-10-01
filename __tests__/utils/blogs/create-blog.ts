import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/consts/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';

import { getBlogDto } from './get-blog-dto';
import { BlogInputDto } from '../../../src/blogs/dto/blog-input-model';
import { BlogViewModel } from '../../../src/blogs/types/blog-view-model';


export async function createBlog(
    app: Express,
    blogDto?: BlogInputDto,
): Promise<BlogViewModel> {
    const defaultBlogData: BlogInputDto = getBlogDto();
    const testBlogData = { ...defaultBlogData, ...blogDto };

    const createBlogResponse = await request(app)

        .post(BLOGS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(testBlogData)
        .expect(HttpStatus.Created);

    return createBlogResponse.body;
}
