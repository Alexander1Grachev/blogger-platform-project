import { WithId } from 'mongodb';
import { Blog } from '../domain/blog';
import { blogsRepository } from '../reposytories/blogs.reposytories';
import { BlogAttributes } from './dtos/blog-attributes';
import { BlogQueryInput } from '../routers/input/blog-query.input';

export const blogsService = {
  async create(dto: BlogAttributes): Promise<string> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,

      createdAt: new Date(),
      isMembership: false,
    };
    const result = await blogsRepository.create(newBlog);

    return result;
  }, //<---🟩

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    const result = await blogsRepository.findByIdOrFail(id);

    return result;
  }, //<---🟩
  async update(id: string, dto: BlogAttributes): Promise<void> {
    await blogsRepository.update(id, dto); // просто ждем завершения
    return; //  возвращаем void
  }, //<---🟩

  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return blogsRepository.findMany(queryDto);
  },

  async delete(id: string): Promise<void> {
    blogsRepository.delete(id);
    return;
  }, //<---🟩
};
