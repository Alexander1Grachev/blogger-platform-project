import { WithId } from 'mongodb';
import { Post } from '../../domain/post';
import { PostViewModel } from '../output/post-view-model';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';

export function mapToPostListPaginatedOutput(
    posts: WithId<Post>[],
    meta: { pageNumber: number, pageSize: number, totalCount: number }
): PostListPaginatedOutput {
    return {
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items: posts.map((post): PostViewModel => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt.toISOString(),
        }))
    };
}