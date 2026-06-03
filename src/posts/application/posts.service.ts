


import { WithId } from "mongodb";
import { BlogsQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { IPost, PostModel } from "../reposytories/models/post.model";
import { PostsRepository } from "../reposytories/posts.repository";
import { PostsQueryRepository } from "../reposytories/posts.query.repository";
import { PostInputDto } from "./dtos/post-input-dto";
import { PostQueryInput } from "../routers/input/post-query.input";
import { BlogPostInputDto } from "../../blogs/application/dtos/blog-post-input-dto";
import { injectable, inject } from "inversify";


@injectable()
export class PostsService {
  constructor(
    @inject(BlogsQueryRepository) private readonly blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @inject(PostsQueryRepository) private readonly postsQueryRepository: PostsQueryRepository,
  ) { };
  async findMany(
    queryDto: PostQueryInput
  ): Promise<{ items: WithId<IPost>[]; totalCount: number }> {
    return this.postsQueryRepository.findMany(queryDto);
  }
  async create(dto: PostInputDto): Promise<string> {
    const blog = await this.blogsQueryRepository.findByIdOrFail(dto.blogId)
    const newPost = new PostModel;
    newPost.title = dto.title
    newPost.shortDescription = dto.shortDescription
    newPost.content = dto.content
    newPost.blogId = dto.blogId
    newPost.blogName = blog.name

    return this.postsRepository.create(newPost)
  }
  async findById(id: string): Promise<WithId<IPost>> {
    return this.postsQueryRepository.findByIdOrFail(id);
  }
  async update(
    id: string,
    dto: PostInputDto
  ): Promise<void> {
    await this.postsRepository.update(id, dto);
  }
  async delete(id: string): Promise<void> {
    await this.postsRepository.delete(id);
  }
  async createPostForBlog(blogId: string, dto: BlogPostInputDto): Promise<string> {
    const blog = await this.blogsQueryRepository.findByIdOrFail(blogId)
    const newPost = new PostModel;
    newPost.title = dto.title
    newPost.shortDescription = dto.shortDescription
    newPost.content = dto.content
    newPost.blogId = blogId
    newPost.blogName = blog.name

    return this.postsRepository.create(newPost);
  }
  async getPostForBlog(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<IPost>[]; totalCount: number }> {
    await this.blogsQueryRepository.findByIdOrFail(blogId)
    return this.postsQueryRepository.getPostForBlog(blogId, queryDto);
  }
}