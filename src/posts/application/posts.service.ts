


import { WithId } from "mongodb";
import { BlogsQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { PostsRepository } from "../reposytories/posts.repository";
import { PostsQueryRepository } from "../reposytories/posts.query.repository";
import { PostInputDto } from "./dtos/post-input-dto";
import { PostQueryInput } from "../routers/input/post-query.input";
import { BlogPostInputDto } from "../../blogs/application/dtos/blog-post-input-dto";
import { injectable, inject } from "inversify";
import { PostDocument, PostModel } from "../domain/post.entity";
import { LikeStatus } from "../../core/consts/like-statuses";
import { LikeTargetType } from "../../likes/domain/like.entity";
import { LikesQueryRepository } from "../../likes/repositories/likes.query.repository";
import { AuthService } from "../../auth/application/auth-user.service";
import { NewestLike } from "../../likes/domain/like-info";
import { PostMapperData } from "./mappers/post-mapper-input";


@injectable()
export class PostsService {
  constructor(
    @inject(BlogsQueryRepository) private readonly blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @inject(PostsQueryRepository) private readonly postsQueryRepository: PostsQueryRepository,
    @inject(LikesQueryRepository) private readonly likesQueryRepository: LikesQueryRepository,
    @inject(AuthService) private readonly authService: AuthService,

  ) { };
  async findMany(
    queryDto: PostQueryInput,
    userId: string | null
  ): Promise<{
    items: PostMapperData[];
    totalCount: number
  }> {
    const { posts, totalCount } = await this.postsQueryRepository.findMany(queryDto);
    const items = await this.enrichPosts(posts, userId);

    return { items: items, totalCount: totalCount }
  }

  async getPostForBlog(
    blogId: string,
    queryDto: PostQueryInput,
    userId: string | null,
  ): Promise<{ items: PostMapperData[]; totalCount: number }> {
    await this.blogsQueryRepository.findByIdOrFail(blogId);

    const { posts, totalCount } = await this.postsQueryRepository.getPostForBlog(blogId, queryDto);
    const items = await this.enrichPosts(posts, userId);
    return { items, totalCount };
  }

  async findById(params: {
    postId: string,
    userId: string | null
  }): Promise<{
    post: PostDocument;
    myStatus: LikeStatus;
    newestLikes: NewestLike[];
  }> {

    const like = params.userId
      ? await this.likesQueryRepository.getUserLike({
        targetId: params.postId,
        targetType: LikeTargetType.Post,
        userId: params.userId
      })
      : null;
    const myStatus = like?.status ?? LikeStatus.None;

    const post = await this.postsQueryRepository.findByIdOrFail(params.postId);
    const newestLikes = await this.likesQueryRepository.getNewestLikes({
      targetId: params.postId,
      targetType: LikeTargetType.Post,
    });
    return {
      post,
      myStatus,
      newestLikes
    }
  }

  async create(dto: PostInputDto): Promise<string> {
    const blog = await this.blogsQueryRepository.findByIdOrFail(dto.blogId)
    const newPost = PostModel.createPost(dto, blog.id, blog.name);

    return this.postsRepository.save(newPost)
  }

  async update(
    id: string,
    dto: PostInputDto
  ): Promise<void> {
    const post = await this.postsQueryRepository.findByIdOrFail(id);
    post.updatePost(dto);
    await this.postsRepository.save(post);
  }

  async delete(id: string): Promise<void> {
    await this.postsRepository.delete(id);
  }

  async createPostForBlog(blogId: string, dto: BlogPostInputDto): Promise<string> {
    const blog = await this.blogsQueryRepository.findByIdOrFail(blogId)
    const newPost = PostModel.createPost(dto, blogId, blog.name);

    return this.postsRepository.save(newPost);
  }
  // -------------------------
  // Private helpers
  // -------------------------
  private async enrichPosts(
    posts: PostDocument[],
    userId: string | null,
  ): Promise<PostMapperData[]> {

    const postIds = posts.map(p => p._id);

    const userStatuses = userId
      ? await this.likesQueryRepository.getListUsersLikes({
        targetId: postIds,
        targetType: LikeTargetType.Post,
        userId: userId,
      }) : new Map<string, LikeStatus>();

    const newestLikes = await this.likesQueryRepository.getListNewestLikes({
      targetId: postIds,
      targetType: LikeTargetType.Post,
    })
    const items = posts.map(post => ({
      post,
      myStatus: userStatuses.get(post._id.toString()) ?? LikeStatus.None,
      newestLikes: newestLikes.get(post._id.toString()) ?? [],
    }))

    return items;
  }

}