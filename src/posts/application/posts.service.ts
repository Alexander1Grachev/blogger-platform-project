import { WithId } from "mongodb";
import { blogsRepository } from "../../blogs/repositories/blogs.repository";
import { Post } from "../reposytories/models/post.model";
import { postsRepository } from "../reposytories/posts.repository";
import { PostInputDto } from "./dtos/post-input-dto";
import { PostQueryInput } from "../routers/input/post-query.input";
import { BlogPostInputDto } from "../../blogs/application/dtos/blog-post-input-dto";

export const postsService = {
    async findMany(
        queryDto: PostQueryInput
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        return postsRepository.findMany(queryDto);
    },
    async create(dto: PostInputDto): Promise<string> {
        const blog = await blogsRepository.findByIdOrFail(dto.blogId)
        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name,
            createdAt: new Date(),
        };
        return postsRepository.create(newPost)
    },
    async findByIdOrFail(id: string): Promise<WithId<Post>> {
        return postsRepository.findByIdOrFail(id);
    },
    async update(
        id: string,
        dto: PostInputDto
    ): Promise<void> {
        return postsRepository.update(id, dto);
    },
    async delete(id: string): Promise<void> {
        return postsRepository.delete(id);
    },
    async createPostForBlog(blogId: string, dto: BlogPostInputDto): Promise<string> {
        const blog = await blogsRepository.findByIdOrFail(blogId)
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
        await blogsRepository.findByIdOrFail(blogId)
        return postsRepository.getPostForBlog(blogId, queryDto);
    },
}