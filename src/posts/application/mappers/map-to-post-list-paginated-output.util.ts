
import { PostViewModel } from '../output/post-view-model';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';
import { PostMapperData } from './post-mapper-input';

export function mapToPostListPaginatedOutput(
  items: PostMapperData[],
  meta: { pageNumber: number, pageSize: number, totalCount: number },

): PostListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: items.map(({ post, myStatus, newestLikes }): PostViewModel => ({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString(),
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: myStatus,
        newestLikes: newestLikes
      }
    }))
  };
}