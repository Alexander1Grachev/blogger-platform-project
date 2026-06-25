
import { PostInputDto } from '../application/dtos/post-input-dto';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { injectable } from "inversify";
import { PostDocument, PostModel } from '../domain/post.entity';


@injectable()
export class PostsRepository {
  async save(newPost: PostDocument): Promise<string> {
    const result = await newPost.save();
    return result._id.toString();
  }



  async delete(id: string): Promise<void> {
    const deleteResult = await PostModel.deleteOne({ _id: id })
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Post does not exist');
    }
  }
};
