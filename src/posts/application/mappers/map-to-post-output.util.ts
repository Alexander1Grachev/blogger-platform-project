import { WithId } from 'mongodb';
import { IPost } from '../../reposytories/models/post.model';
import { PostViewModel } from '../output/post-view-model';

export function mapToPostOutput(
    post: WithId<IPost>,
): PostViewModel {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt.toISOString(),
    };
}