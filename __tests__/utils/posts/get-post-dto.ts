import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';
// функ. ожидает когда ей передадут blogId
export function getPostDto(blogId: string): PostAttributes {
  return {
    title: 'Default Post Title',
    shortDescription: 'Default short description',
    content: 'Default post content',
    blogId: blogId, //  Получает blogId извне
  };
}
