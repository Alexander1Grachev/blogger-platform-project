import { IPost } from './models/post.model';
import { PostModel } from './models/post.model';

import { PostInputDto } from '../application/dtos/post-input-dto';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { injectable } from "inversify";


@injectable()
export class PostsRepository {
  async create(newPost: IPost): Promise<string> {
    const result = await PostModel.create(newPost);
    return result._id.toString();
  }

  async update(id: string, input: PostInputDto): Promise<void> {
    const updateResult = await PostModel.updateOne(
      { _id: id },
      {
        $set: {
          title: input.title,
          shortDescription: input.shortDescription,
          content: input.content,
          blogId: input.blogId
        }
      },
    );
    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Post does not exist');
    }
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await PostModel.deleteOne({ _id: id })
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Post does not exist');
    }
  }
};
