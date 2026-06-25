import { WithId } from "mongodb";


import { BlogsRepository } from "../repositories/blogs.repository";
import { BlogsQueryRepository } from "../repositories/blogs.query.repository";

import { BlogQueryInput } from "../routers/input/blog-query.input";
import { BlogInputDto } from "./dtos/blog-input-dto";
import { inject, injectable } from "inversify";
import { BlogDocument, BlogModel } from "../domain/blog.entity";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
    @inject(BlogsQueryRepository) private readonly blogsQueryRepository: BlogsQueryRepository
  ) { };

  async create(dto: BlogInputDto): Promise<string> {
    const newBlog = BlogModel.createBlog(dto)

    return this.blogsRepository.save(newBlog);
  }
  async findById(id: string): Promise<BlogDocument> {
    return this.blogsQueryRepository.findByIdOrFail(id);
  }
  async update(id: string, dto: BlogInputDto): Promise<void> {
    const blog = await this.blogsQueryRepository.findByIdOrFail(id);
    blog.updateBlog(dto);
    await this.blogsRepository.save(blog);
  }

  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: BlogDocument[]; totalCount: number }> {
    return this.blogsQueryRepository.findMany(queryDto);
  }

  async delete(id: string): Promise<void> {
    await this.blogsRepository.delete(id);
  }
}