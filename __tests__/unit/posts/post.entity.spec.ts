import { PostEntity } from "../../../src/posts/domain/post.entity";

describe('PostEntity', () => {
  const dto = {
    title: 'Test post',
    shortDescription: 'Short desc',
    content: 'Content',
  };
  const blogId = 'blogId123';
  const blogName = 'Test Blog';

  it('should create post with empty extendedLikesInfo', () => {
    const post = PostEntity.createPost(dto, blogId, blogName);

    expect(post.extendedLikesInfo.likesCount).toBe(0);
    expect(post.extendedLikesInfo.dislikesCount).toBe(0);
    expect(post.extendedLikesInfo.newestLikes).toEqual([]);
  });
})
