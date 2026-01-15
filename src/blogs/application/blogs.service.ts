import { WithId } from "mongodb";
import { Blog } from "../domain/blog";
import { blogsRepository } from "../repositories/blogs.repository";
import { BlogQueryInput } from "../routers/input/blog-query.input";
import { BlogInputDto } from "./dtos/blog-input-model";

export const blogsService = {
  async create(dto: BlogInputDto): Promise<string> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    }
    return blogsRepository.create(newBlog);
  },
  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    return blogsRepository.findByIdOrFail(id);
  },
  async update(id: string, dto: BlogInputDto): Promise<void> {
    return blogsRepository.update(id, dto);
  },

  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return blogsRepository.findMany(queryDto);
  },

  async delete(id: string): Promise<void> {
    return blogsRepository.delete(id);
  },

}