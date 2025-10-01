import { Express } from 'express';
import { clearDb } from './clear-db';
import { createBlog } from './blogs/create-blog';



export async function createFirstBlog(app: Express): Promise<string> {
    await clearDb(app);
    const blog = await createBlog(app);
    return blog.id;
}