import { PostInputDto } from '../../../src/posts/application/dtos/post-input-model';
// функ. ожидает когда ей передадут blogId
export function getPostDto(blogId: string): PostInputDto {
  return {
    title: 'Default Post Title',
    shortDescription: 'Default short description',
    content: 'Default post content',
    blogId: blogId, //  Получает blogId извне
  };
}
