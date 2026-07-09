import { PostViewModel } from '../output/post-view-model';
import { PostMapperData } from './post-mapper-input';
export function mapToPostOutput(
  { post, myStatus, newestLikes }: PostMapperData
): PostViewModel {
  return {
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
  };
}