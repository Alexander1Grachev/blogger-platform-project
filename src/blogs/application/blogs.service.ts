import { WithId } from "mongodb";
import { IBlog } from "../repositories/models/blog.model";
import { BlogModel } from "../repositories/models/blog.model";

import { BlogsRepository } from "../repositories/blogs.repository";
import { BlogsQueryRepository } from "../repositories/blogs.query.repository";

import { BlogQueryInput } from "../routers/input/blog-query.input";
import { BlogInputDto } from "./dtos/blog-input-dto";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
    @inject(BlogsQueryRepository) private readonly blogsQueryRepository: BlogsQueryRepository
  ) { };

  async create(dto: BlogInputDto): Promise<string> {
    const newBlog = new BlogModel()
    newBlog.name = dto.name
    newBlog.description = dto.description
    newBlog.websiteUrl = dto.websiteUrl
    newBlog.createdAt = new Date()
    newBlog.isMembership = false

    return this.blogsRepository.create(newBlog);
  }
  async findById(id: string): Promise<WithId<IBlog>> {
    return this.blogsQueryRepository.findByIdOrFail(id);
  }
  async update(id: string, dto: BlogInputDto): Promise<void> {
    await this.blogsRepository.update(id, dto);
  }

  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<IBlog>[]; totalCount: number }> {
    return this.blogsQueryRepository.findMany(queryDto);
  }

  async delete(id: string): Promise<void> {
    await this.blogsRepository.delete(id);
  }
}