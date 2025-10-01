import { BlogInputDto } from '../../../src/blogs/dto/blog-input-model';

export function getBlogDto(): BlogInputDto {
    return {
        name: 'Tea Blog',
        description: 'All about tea and tea culture',
        websiteUrl: 'https://example.com/tea-blog',
        
    };
}