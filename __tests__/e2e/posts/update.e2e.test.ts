import { updatePost } from '../../utils/posts/update-post';
import { createPost } from '../../utils/posts/create-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { clearDb } from '../../utils/clear-db';
import { getTestApp } from '../../setup/start-test-app';
import { PostInputDto } from '../../../src/posts/application/dtos/post-input-dto';

describe('UPDATE posts', () => {
  const app = getTestApp();

  let postId: string;
  let blogId: string;

  beforeAll(async () => {
    await clearDb(app);
    const post = await createPost(app);
    postId = post.id;
    blogId = post.blogId;
  });

  it('✅ should update post with valid data', async () => {
    const postUpdateData: PostInputDto = {
      title: 'Updatedtitle',
      shortDescription: 'UpdatedDescription',
      content: 'UpdatedContent',
      blogId: blogId,
    };

    await updatePost(app, postId, postUpdateData);

    // Проверяем результат
    const post = await getPostById(app, postId);

    expect(post).toMatchObject({
      id: postId,
      ...postUpdateData,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });
});
