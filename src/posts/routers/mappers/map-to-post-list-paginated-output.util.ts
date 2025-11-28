import { WithId } from 'mongodb';
import { ResourceType } from '../../../core/consts/resource-type';
import { Post } from '../../domain/post';
import { PostDataOutput } from '../output/post-data.output';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';

export function mapToPostListPaginatedOutput(
  posts: WithId<Post>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): PostListPaginatedOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: posts.map(
      (post): PostDataOutput => ({
        type: ResourceType.Posts,
        id: post._id.toString(),
        attributes: {
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt.toISOString(),
        },
      }),
    ),
  };
}
