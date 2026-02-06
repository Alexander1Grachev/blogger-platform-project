import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog';
import { BlogViewModel } from '../output/blog-view-model';

export function mapToBlogOutput(blog: WithId<Blog>): BlogViewModel {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt.toISOString(),
        isMembership: blog.isMembership,
    };
}