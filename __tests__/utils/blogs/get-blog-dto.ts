import { BlogInputDto } from '../../../src/blogs/application/dtos/blog-input-model';


// Функция которая возвращает данные
export function getBlogDto(): BlogInputDto {
  return {
    name: 'Tea Blog',
    description: 'All about tea and tea culture',
    websiteUrl: 'https://example.com/tea-blog',
  };
}

/* Константа которая использует функцию
export const correctTestBlogAttributes: BlogInputDto = getBlogDto();

// Использование в тестах
export const correctTestBlogData: BlogCreateInput = {
  data: {
    type: ResourceType.Blogs,
    attributes: correctTestBlogAttributes, //  понятно что здесь
  },
};
*/