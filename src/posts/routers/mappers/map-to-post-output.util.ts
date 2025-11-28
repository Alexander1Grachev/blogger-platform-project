import { WithId } from 'mongodb';
import { Post } from '../../domain/post';
import { ResourceType } from '../../../core/consts/resource-type';
import { PostOutput } from '../output/post.output';

export function mapToPostOutput(post: WithId<Post>): PostOutput {
  return {
    data: {
      type: ResourceType.Posts,
      id: post._id.toString(),
      attributes: {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt.toISOString(),
      },
    },
  };
}
