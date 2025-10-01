import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { PostInputDto } from '../../../src/posts/dto/post-input-model';
import { updatePost } from '../../utils/posts/update-post';
import { createFirstBlog } from '../../utils/create.first.blog-test.utils';
import { createPost } from '../../utils/posts/create-post';
import { getPostById } from '../../utils/posts/get-post-by-id';

describe('UPDATE posts', () => {
  const app = express();
  setupApp(app);

  let postId: string;
  let blogId: string;

  beforeAll(async () => {
    blogId = await createFirstBlog(app);
    const createdPost = await createPost(app, blogId);
    postId = createdPost.id;

    console.log('🎯 TEST SETUP COMPLETE:', { postId, blogId });
  });

  it('✅ should update post with valid data', async () => {
    const updatedPostData: PostInputDto = {
      title: 'Updated title',
      shortDescription: 'Updated shortDescription',
      content: 'Updated content',
      blogId: blogId,
    };

    console.log('🔄 BEFORE UPDATE TEST:', {
      postId,
      blogId,
      updatedPostData
    });

    // Через утилиту
    try {
      await updatePost(app, postId, updatedPostData);
      console.log('✅ UPDATE VIA UTILITY SUCCESS');
    } catch {
      console.log('❌ UPDATE VIA UTILITY FAILED');
    }

    // Проверяем результат
    const post = await getPostById(app, postId);
    console.log('✅ UPDATED POST ID:', post.id);

    expect(post).toMatchObject({
      id: postId,
      ...updatedPostData,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });
});