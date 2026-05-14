import { WithId } from "mongodb";
import { BlogsRepository } from "../../blogs/repositories/blogs.repository";
import { Post } from "../reposytories/models/post.model";
import { PostsRepository } from "../reposytories/posts.repository";
import { PostInputDto } from "./dtos/post-input-dto";
import { PostQueryInput } from "../routers/input/post-query.input";
import { BlogPostInputDto } from "../../blogs/application/dtos/blog-post-input-dto";
import { injectable, inject } from "inversify";


@injectable()
export class PostsService {
  constructor(
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,

  ) { };
  async findMany(
    queryDto: PostQueryInput
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return this.postsRepository.findMany(queryDto);
  }
  async create(dto: PostInputDto): Promise<string> {
    const blog = await this.blogsRepository.findByIdOrFail(dto.blogId)
    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };
    return this.postsRepository.create(newPost)
  }
  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    return this.postsRepository.findByIdOrFail(id);
  }
  async update(
    id: string,
    dto: PostInputDto
  ): Promise<void> {
    return this.postsRepository.update(id, dto);
  }
  async delete(id: string): Promise<void> {
    return this.postsRepository.delete(id);
  }
  async createPostForBlog(blogId: string, dto: BlogPostInputDto): Promise<string> {
    const blog = await this.blogsRepository.findByIdOrFail(blogId)
    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };
    return this.postsRepository.create(newPost);
  }
  async getPostForBlog(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    await this.blogsRepository.findByIdOrFail(blogId)
    return this.postsRepository.getPostForBlog(blogId, queryDto);
  }
}