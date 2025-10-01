import { WithId } from 'mongodb';
import { Post } from '../../types/post';
import { PostViewModel } from '../../types/post-view-model';
import { Blog } from '../../../blogs/types/blog';

export function mapToPostViewModel(post: WithId<Post>,blog: WithId<Blog>): PostViewModel {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: blog._id.toString(),
        blogName: blog.name,
        createdAt: post.createdAt.toISOString(),
    };
}