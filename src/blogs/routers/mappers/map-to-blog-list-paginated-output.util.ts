import { WithId } from 'mongodb';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated.output';
import { BlogDataOutput } from '../output/blog-data.output';
import { Blog } from '../../domain/blog';
import { ResourceType } from '../../../core/consts/resource-type';

export function mapToBlogListPaginatedOutput(
  blogs: WithId<Blog>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): BlogListPaginatedOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: blogs.map(
      (blog): BlogDataOutput => ({
        type: ResourceType.Blogs,
        id: blog._id.toString(),
        attributes: {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
          createdAt: blog.createdAt.toISOString(),
          isMembership: blog.isMembership,
        },
      }),
    ),
  };
}
