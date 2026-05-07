import { WithId } from "mongodb";
import { Blog } from "../repositories/models/blog.model";
import { BlogsRepository } from "../repositories/blogs.repository";
import { BlogQueryInput } from "../routers/input/blog-query.input";
import { BlogInputDto } from "./dtos/blog-input-dto";

export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) { };


  async create(dto: BlogInputDto): Promise<string> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    }
    return this.blogsRepository.create(newBlog);
  }
  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    return this.blogsRepository.findByIdOrFail(id);
  }
  async update(id: string, dto: BlogInputDto): Promise<void> {
    return this.blogsRepository.update(id, dto);
  }

  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return this.blogsRepository.findMany(queryDto);
  }

  async delete(id: string): Promise<void> {
    return this.blogsRepository.delete(id);
  }

}