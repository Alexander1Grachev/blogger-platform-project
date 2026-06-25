import { BlogViewModel } from '../output/blog-view-model';
import { BlogDocument } from '../../domain/blog.entity';

export function mapToBlogOutput(blog: BlogDocument): BlogViewModel {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
  };
}