import { BlogViewModel } from '../output/blog-view-model';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated.output';
import { BlogDocument } from '../../domain/blog.entity';

export function mapToBlogListPaginatedOutput(
  blogs: BlogDocument[],
  meta: { pageNumber: number, pageSize: number, totalCount: number }
): BlogListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: blogs.map((blog): BlogViewModel => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership,
    }))
  };
}