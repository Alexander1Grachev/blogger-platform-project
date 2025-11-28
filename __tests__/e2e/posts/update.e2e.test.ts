import { updatePost } from '../../utils/posts/update-post';
import { createPost } from '../../utils/posts/create-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { clearDb } from '../../utils/clear-db';
import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';
import { ResourceType } from '../../../src/core/consts/resource-type';
import { getTestApp } from '../../setup/start-test-app';

describe('UPDATE posts', () => {
  const app = getTestApp();

  let postId: string;
  let blogId: string;

  beforeAll(async () => {
    await clearDb(app);
    const post = await createPost(app);
    postId = post.data.id;
    blogId = post.data.attributes.blogId;
  });

  it('✅ should update post with valid data', async () => {
    const postUpdateData: PostAttributes = {
      title: 'Updatedtitle',
      shortDescription: 'UpdatedDescription',
      content: 'UpdatedContent',
      blogId: blogId,
    };

    await updatePost(app, postId, postUpdateData);

    // Проверяем результат
    const post = await getPostById(app, postId);

    expect(post).toMatchObject({
      data: {
        type: ResourceType.Posts,
        id: postId,
        attributes: {
          ...postUpdateData,
          blogName: expect.any(String),
          createdAt: expect.any(String),
        },
      },
    });
  });
});
