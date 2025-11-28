import { Express } from 'express';
import { createBlog } from './blogs/create-blog';

export async function createFirstBlog(app: Express): Promise<string> {
  //await clearDb(app);
  const blog = await createBlog(app);

  // ДОБАВИМ ОТЛАДКУ ДЛЯ ДИАГНОСТИКИ
  console.log(
    '🔍 [DEBUG] createFirstBlog - blog response:',
    JSON.stringify(blog, null, 2),
  );
  console.log('🔍 [DEBUG] blog.data:', blog?.data);
  console.log('🔍 [DEBUG] blog.data?.id:', blog?.data?.id);

  if (!blog?.data?.id) {
    throw new Error(
      `Blog creation failed! Expected blog.data.id but got: ${JSON.stringify(blog)}`,
    );
  }

  return blog.data.id;
}
