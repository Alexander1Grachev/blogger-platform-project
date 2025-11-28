import { WithId } from 'mongodb';
import { postsRepository } from '../reposytories/posts.reposytories';
import { Post } from '../domain/post';
import { PostAttributes } from './dtos/post-attributes';
import { blogsRepository } from '../../blogs/reposytories/blogs.reposytories';
import { PostQueryInput } from '../routers/input/post-query.input';

export const postsService = {
  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return postsRepository.findMany(queryDto);
  },

  async create(dto: PostAttributes): Promise<string> {
    const blog = await blogsRepository.findByIdOrFail(dto.blogId);

    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };

    return postsRepository.create(newPost);
  },
  async update(id: string, dto: PostAttributes): Promise<void> {
    return postsRepository.update(id, dto);
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    return postsRepository.findByIdOrFail(id);
  },

  async delete(id: string): Promise<void> {
    return postsRepository.delete(id);
  },

  async createPostForBlog(
    dto: PostAttributes,
    blogId: string,
  ): Promise<string> {
    const blog = await blogsRepository.findByIdOrFail(blogId);

    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };
    return postsRepository.create(newPost);
  },

  async getPostForBlog(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return postsRepository.getPostForBlog(blogId, queryDto);
  },
};
