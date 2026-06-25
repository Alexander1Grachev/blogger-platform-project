

import { BlogInputDto } from '../application/dtos/blog-input-dto';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { injectable } from "inversify";
import { BlogDocument, BlogModel } from '../domain/blog.entity';

@injectable()
export class BlogsRepository {

  async save(newBlog: BlogDocument): Promise<string> {
    const result = await newBlog.save();
    return result._id.toString()
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await BlogModel.deleteOne({ _id: id })

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Blog does not exist');
    }
  }
};
