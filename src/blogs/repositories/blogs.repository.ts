import { IBlog } from './models/blog.model';
import { BlogModel } from './models/blog.model';

import { BlogInputDto } from '../application/dtos/blog-input-dto';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { injectable } from "inversify";

@injectable()
export class BlogsRepository {

  async create(newBlog: IBlog): Promise<string> {
    const result = await BlogModel.create(newBlog);
    return result._id.toString()
  }

  async update(id: string, dto: BlogInputDto): Promise<void> {
    const updateResult = await BlogModel.updateOne(
      {
        _id: id
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      }
    );

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Blog does not exist');
    }
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await BlogModel.deleteOne({ _id: id })

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Blog does not exist');
    }
  }
};
