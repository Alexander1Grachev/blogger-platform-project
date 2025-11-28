import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';
import { BlogCreateInput } from '../../../src/blogs/routers/input/blog-create.input';
import { ResourceType } from '../../../src/core/consts/resource-type';

// Функция которая возвращает данные
export function getBlogDto(): BlogAttributes {
  return {
    name: 'Tea Blog',
    description: 'All about tea and tea culture',
    websiteUrl: 'https://example.com/tea-blog',
  };
}

// Константа которая использует функцию
export const correctTestBlogAttributes: BlogAttributes = getBlogDto();

// Использование в тестах
export const correctTestBlogData: BlogCreateInput = {
  data: {
    type: ResourceType.Blogs,
    attributes: correctTestBlogAttributes, //  понятно что здесь
  },
};
