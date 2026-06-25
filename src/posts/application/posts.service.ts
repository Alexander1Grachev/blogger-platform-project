


import { WithId } from "mongodb";
import { BlogsQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { PostsRepository } from "../reposytories/posts.repository";
import { PostsQueryRepository } from "../reposytories/posts.query.repository";
import { PostInputDto } from "./dtos/post-input-dto";
import { PostQueryInput } from "../routers/input/post-query.input";
import { BlogPostInputDto } from "../../blogs/application/dtos/blog-post-input-dto";
import { injectable, inject } from "inversify";
import { PostDocument, PostModel } from "../domain/post.entity";


@injectable()
export class PostsService {
  constructor(
    @inject(BlogsQueryRepository) private readonly blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @inject(PostsQueryRepository) private readonly postsQueryRepository: PostsQueryRepository,
  ) { };

  async findMany(
    queryDto: PostQueryInput
  ): Promise<{ items: PostDocument[]; totalCount: number }> {
    return this.postsQueryRepository.findMany(queryDto);
  }

  async create(dto: PostInputDto): Promise<string> {
    const blog = await this.blogsQueryRepository.findByIdOrFail(dto.blogId)
    const newPost = PostModel.createPost(dto, blog.id, blog.name);

    return this.postsRepository.save(newPost)
  }

  async findById(id: string): Promise<PostDocument> {
    return this.postsQueryRepository.findByIdOrFail(id);
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

  async getPostForBlog(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: PostDocument[]; totalCount: number }> {
    await this.blogsQueryRepository.findByIdOrFail(blogId)
    
    return this.postsQueryRepository.getPostForBlog(blogId, queryDto);
  }
}